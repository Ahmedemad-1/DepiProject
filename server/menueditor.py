#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Menu Editor - a Windows desktop editor for the menu of a json-server restaurant site.

The app edits ONLY the "categories" and "menuItems" arrays of db.json.  Every other
top-level key (settings, users, orders, orderItems, reservations) is re-read fresh from
disk at save time and written back untouched.

Requires: Python 3.10+, PySide6, Pillow.
"""
from __future__ import annotations

import copy
import json
import math
import os
import re
import shutil
import sys
import tempfile
import unicodedata
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from PIL import Image, ImageOps
from PySide6.QtCore import QPointF, QRectF, QSize, Qt, QTimer, Signal
from PySide6.QtGui import (
    QAction, QBrush, QColor, QCursor, QFont, QImage, QKeySequence, QPainter,
    QPainterPath, QPalette, QPen, QPixmap,
)
from PySide6.QtWidgets import (
    QAbstractItemView, QApplication, QCheckBox, QComboBox, QDialog,
    QDialogButtonBox, QDoubleSpinBox, QFileDialog, QFormLayout, QFrame,
    QGridLayout, QGroupBox, QHBoxLayout, QHeaderView, QInputDialog, QLabel,
    QLineEdit, QListWidget, QListWidgetItem, QMainWindow, QMenu, QMessageBox,
    QPlainTextEdit, QPushButton, QScrollArea, QSizePolicy, QSpinBox,
    QSplitter, QStyledItemDelegate, QTableWidget, QTableWidgetItem, QToolBar,
    QVBoxLayout, QWidget,
)

APP_NAME = "Menu Editor"
CONFIG_DIR_NAME = "MenuEditor"
SIZES: tuple[str, ...] = ("small", "medium", "large")
SIZE_LABELS = {"small": "Small", "medium": "Medium", "large": "Large"}
DEFAULT_MULTIPLIERS = {"small": 0.7, "medium": 1.0, "large": 1.2}
# Key order of a menu item as written to db.json.
ITEM_KEYS: tuple[str, ...] = (
    "id", "name", "nameAr", "description", "descriptionAr", "basePrice", "image",
    "categoryId", "isVegetarian", "isAvailable", "availableSizes", "extras",
)
ALL_ID = -1  # pseudo category id for the "All dishes" entry
RESAMPLE = getattr(Image, "Resampling", Image)  # Pillow >= 9.1 or older


# --------------------------------------------------------------------------- #
# Generic helpers
# --------------------------------------------------------------------------- #
def script_dir() -> Path:
    """Folder of the script (or of the .exe when frozen by PyInstaller)."""
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def slugify(text: str) -> str:
    """'Anise (Yansoon)' -> 'anise-yansoon'. Accents are stripped, other chars become '-'."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def to_int(value: Any) -> Optional[int]:
    """Best-effort int conversion; None if impossible."""
    try:
        if isinstance(value, bool):
            return None
        return int(value)
    except (TypeError, ValueError):
        return None


def is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def num_out(value: float) -> int | float:
    """Write whole numbers as ints (60, not 60.0) so the JSON stays tidy."""
    f = float(value)
    return int(f) if f.is_integer() else round(f, 2)


def fmt_num(value: float) -> str:
    f = float(value)
    return str(int(f)) if f.is_integer() else f"{f:.2f}".rstrip("0").rstrip(".")


def price_for(base: float, mult: float) -> float:
    """Price rounded to whole cents (half rounds up, unlike Python's banker's round)."""
    return math.floor(base * mult * 100 + 0.5) / 100


def arabic_font(size: int = 10) -> QFont:
    font = QFont("Segoe UI", size)
    font.setFamilies(["Segoe UI", "Tahoma", "Arial"])
    return font


def image_basename(web_path: str) -> str:
    """'/images/koshary.jpg' -> 'koshary.jpg'."""
    return os.path.basename((web_path or "").replace("\\", "/"))


def load_pil_image(path: str) -> Image.Image:
    """Load an image, honour EXIF orientation, flatten transparency onto white, return RGB."""
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        im.load()
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            rgba = im.convert("RGBA")
            bg = Image.new("RGB", rgba.size, (255, 255, 255))
            bg.paste(rgba, mask=rgba.split()[-1])
            return bg
        return im.convert("RGB")


def pil_to_qimage(img: Image.Image) -> QImage:
    img = img.convert("RGB")
    w, h = img.size
    data = img.tobytes("raw", "RGB")
    return QImage(data, w, h, 3 * w, QImage.Format_RGB888).copy()  # copy -> owns its memory


def msg_error(parent: Optional[QWidget], title: str, text: str, detail: str = "") -> None:
    box = QMessageBox(QMessageBox.Critical, title, text, QMessageBox.Ok, parent)
    if detail:
        box.setDetailedText(detail)
    box.exec()


def msg_info(parent: Optional[QWidget], title: str, text: str, detail: str = "",
             icon: QMessageBox.Icon = QMessageBox.Information) -> None:
    box = QMessageBox(icon, title, text, QMessageBox.Ok, parent)
    if detail:
        box.setDetailedText(detail)
    box.exec()


def confirm(parent: Optional[QWidget], title: str, text: str, default_yes: bool = False) -> bool:
    default = QMessageBox.Yes if default_yes else QMessageBox.No
    return QMessageBox.question(parent, title, text, QMessageBox.Yes | QMessageBox.No,
                                default) == QMessageBox.Yes


def ask3(parent: Optional[QWidget], title: str, text: str,
         yes: str = "Apply", no: str = "Discard") -> str:
    """Three-way question. Returns 'yes', 'no' or 'cancel'."""
    box = QMessageBox(QMessageBox.Question, title, text, QMessageBox.NoButton, parent)
    b_yes = box.addButton(yes, QMessageBox.AcceptRole)
    b_no = box.addButton(no, QMessageBox.DestructiveRole)
    b_cancel = box.addButton("Cancel", QMessageBox.RejectRole)
    box.setDefaultButton(b_yes)
    box.setEscapeButton(b_cancel)
    box.exec()
    clicked = box.clickedButton()
    if clicked is b_yes:
        return "yes"
    if clicked is b_no:
        return "no"
    return "cancel"


_THUMB_CACHE: dict[tuple[str, int], Optional[QPixmap]] = {}


def thumbnail_for(path: Path, size: QSize = QSize(56, 42)) -> Optional[QPixmap]:
    """Cached small thumbnail for the dish table; None if the file is missing/unreadable."""
    try:
        key = (str(path), path.stat().st_mtime_ns)
    except OSError:
        return None
    if key not in _THUMB_CACHE:
        pix = QPixmap(str(path))
        _THUMB_CACHE[key] = None if pix.isNull() else pix.scaled(
            size, Qt.KeepAspectRatio, Qt.SmoothTransformation)
    return _THUMB_CACHE[key]


# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #
@dataclass
class AppConfig:
    """User settings stored in %APPDATA%\\MenuEditor\\config.json (fallback: next to the script)."""
    db_path: str = ""
    images_dir: str = ""
    aspect_w: int = 4
    aspect_h: int = 3
    out_width: int = 800
    jpeg_quality: int = 85
    theme: str = "system"  # "system" | "light" | "dark"

    @property
    def ratio(self) -> float:
        return self.aspect_w / self.aspect_h

    @property
    def out_height(self) -> int:
        return max(1, round(self.out_width * self.aspect_h / self.aspect_w))

    @staticmethod
    def candidate_paths() -> list[Path]:
        paths: list[Path] = []
        appdata = os.environ.get("APPDATA")
        if appdata:
            paths.append(Path(appdata) / CONFIG_DIR_NAME / "config.json")
        paths.append(script_dir() / "config.json")
        return paths

    @classmethod
    def load(cls) -> tuple["AppConfig", bool]:
        """Return (config, existed). Never raises: bad/missing files give defaults."""
        for path in cls.candidate_paths():
            if path.is_file():
                try:
                    raw = json.loads(path.read_text(encoding="utf-8-sig"))
                    cfg = cls()
                    cfg.db_path = str(raw.get("db_path", ""))
                    cfg.images_dir = str(raw.get("images_dir", ""))
                    cfg.aspect_w = max(1, to_int(raw.get("aspect_w")) or 4)
                    cfg.aspect_h = max(1, to_int(raw.get("aspect_h")) or 3)
                    cfg.out_width = min(4000, max(50, to_int(raw.get("out_width")) or 800))
                    cfg.jpeg_quality = min(100, max(1, to_int(raw.get("jpeg_quality")) or 85))
                    theme = str(raw.get("theme", "system"))
                    cfg.theme = theme if theme in ("system", "light", "dark") else "system"
                    return cfg, True
                except (OSError, ValueError, AttributeError):
                    continue
        return cls(), False

    def save(self) -> Path:
        """Write the config, trying %APPDATA% first and the script folder second."""
        payload = json.dumps({
            "db_path": self.db_path, "images_dir": self.images_dir,
            "aspect_w": self.aspect_w, "aspect_h": self.aspect_h,
            "out_width": self.out_width, "jpeg_quality": self.jpeg_quality, "theme": self.theme,
        }, indent=2, ensure_ascii=False)
        last_error: Optional[Exception] = None
        for path in self.candidate_paths():
            try:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(payload, encoding="utf-8")
                return path
            except OSError as exc:
                last_error = exc
        raise OSError(f"Could not write config file: {last_error}")


# --------------------------------------------------------------------------- #
# Data model / storage
# --------------------------------------------------------------------------- #
def order_item(raw: dict[str, Any]) -> dict[str, Any]:
    """Re-order the keys of a menu item to the canonical order; unknown keys go last."""
    out = {k: raw[k] for k in ITEM_KEYS if k in raw}
    for k, v in raw.items():
        if k not in out:
            out[k] = v
    return out


def normalize_item(raw: dict[str, Any]) -> dict[str, Any]:
    """Fill defaults for older items (descriptionAr, availableSizes) and order the keys."""
    sizes_raw = raw.get("availableSizes")
    if isinstance(sizes_raw, list):
        sizes = [s for s in SIZES if s in sizes_raw]
    else:  # missing -> all sizes
        sizes = list(SIZES)
    extras: list[dict[str, Any]] = []
    for e in raw.get("extras") or []:
        if not isinstance(e, dict):
            continue
        ne: dict[str, Any] = {
            "name": str(e.get("name", "")),
            "nameAr": str(e.get("nameAr", "")),
            "price": e.get("price", 0) if is_number(e.get("price", 0)) else 0,
        }
        for k, v in e.items():
            ne.setdefault(k, v)
        extras.append(ne)
    base = raw.get("basePrice", 0)
    values: dict[str, Any] = {
        "id": raw.get("id"),
        "name": str(raw.get("name", "") or ""),
        "nameAr": str(raw.get("nameAr", "") or ""),
        "description": str(raw.get("description", "") or ""),
        "descriptionAr": str(raw.get("descriptionAr", "") or ""),
        "basePrice": base if is_number(base) else 0,
        "image": str(raw.get("image", "") or ""),
        "categoryId": raw.get("categoryId"),
        "isVegetarian": bool(raw.get("isVegetarian", False)),
        "isAvailable": bool(raw.get("isAvailable", True)),
        "availableSizes": sizes,
        "extras": extras,
    }
    for k, v in raw.items():
        values.setdefault(k, v)
    return order_item(values)


def validate_item(item: dict[str, Any], category_ids: set[Any]) -> list[str]:
    """Blocking validation of a single dish. Returns a list of error messages."""
    errors: list[str] = []
    label = str(item.get("name") or "").strip() or str(item.get("nameAr") or "").strip() \
        or f"Dish #{item.get('id')}"
    if not str(item.get("name") or "").strip():
        errors.append(f"{label}: the English name is required.")
    if not str(item.get("nameAr") or "").strip():
        errors.append(f"{label}: the Arabic name is required.")
    price = item.get("basePrice")
    if not is_number(price) or price < 0:
        errors.append(f"{label}: the price must be a number >= 0.")
    if item.get("categoryId") not in category_ids:
        errors.append(f"{label}: choose a valid category.")
    sizes = item.get("availableSizes")
    if not isinstance(sizes, list) or not sizes or any(s not in SIZES for s in sizes):
        errors.append(f"{label}: at least one size (small/medium/large) must be available.")
    for i, extra in enumerate(item.get("extras") or [], 1):
        if not str(extra.get("name") or "").strip():
            errors.append(f"{label}: extra #{i} needs a name.")
        p = extra.get("price")
        if not is_number(p) or p < 0:
            errors.append(f"{label}: extra #{i} needs a price >= 0.")
    return errors


class Storage:
    """In-memory copy of categories/menuItems plus all disk logic (load, backup, atomic save)."""

    def __init__(self) -> None:
        self.path: str = ""
        self.settings: dict[str, Any] = {}
        self.categories: list[dict[str, Any]] = []
        self.items: list[dict[str, Any]] = []
        self.order_menu_ids: set[int] = set()
        self.mtime_ns: int = 0

    # ---- reading ---------------------------------------------------------
    @staticmethod
    def read_json(path: str) -> dict[str, Any]:
        with open(path, "r", encoding="utf-8-sig") as fh:
            data = json.load(fh)
        if not isinstance(data, dict):
            raise ValueError("The file does not contain a JSON object at the top level.")
        return data

    @staticmethod
    def collect_order_ids(data: dict[str, Any]) -> set[int]:
        ids: set[int] = set()
        for row in data.get("orderItems") or []:
            if isinstance(row, dict):
                n = to_int(row.get("menuItemId"))
                if n is not None:
                    ids.add(n)
        return ids

    def load(self, path: str) -> None:
        """Load db.json. Raises on problems; the caller shows the message."""
        data = self.read_json(path)
        if not isinstance(data.get("categories"), list) or not isinstance(data.get("menuItems"), list):
            raise ValueError('This file has no "categories" and "menuItems" arrays, '
                             "so it does not look like the restaurant db.json.")
        cats: list[dict[str, Any]] = []
        for c in data["categories"]:
            if isinstance(c, dict):
                cc = dict(c)
                cc["name"] = str(cc.get("name", "") or "")
                cc["nameAr"] = str(cc.get("nameAr", "") or "")
                cats.append({k: cc[k] for k in ("id", "name", "nameAr") if k in cc} |
                            {k: v for k, v in cc.items() if k not in ("id", "name", "nameAr")})
        self.categories = cats
        self.items = [normalize_item(m) for m in data["menuItems"] if isinstance(m, dict)]
        self.settings = data.get("settings") if isinstance(data.get("settings"), dict) else {}
        self.order_menu_ids = self.collect_order_ids(data)
        self.path = path
        self.mtime_ns = os.stat(path).st_mtime_ns

    def refresh_order_refs(self) -> None:
        """Re-read orderItems from disk (orders may have been placed since opening)."""
        try:
            self.order_menu_ids = self.collect_order_ids(self.read_json(self.path))
        except (OSError, ValueError):
            pass  # keep the cached copy

    # ---- queries ---------------------------------------------------------
    def multipliers(self) -> dict[str, float]:
        raw = self.settings.get("sizeMultipliers") if isinstance(self.settings, dict) else None
        out = dict(DEFAULT_MULTIPLIERS)
        if isinstance(raw, dict):
            for k in SIZES:
                if is_number(raw.get(k)):
                    out[k] = float(raw[k])
        return out

    @property
    def currency(self) -> str:
        return str(self.settings.get("currency") or "USD")

    def item_by_id(self, item_id: Any) -> Optional[dict[str, Any]]:
        return next((i for i in self.items if i.get("id") == item_id), None)

    def category_by_id(self, cat_id: Any) -> Optional[dict[str, Any]]:
        return next((c for c in self.categories if c.get("id") == cat_id), None)

    def count_in_category(self, cat_id: Any) -> int:
        return sum(1 for i in self.items if i.get("categoryId") == cat_id)

    def next_item_id(self) -> int:
        """max(menuItems ids, orderItems.menuItemId) + 1 - ids are never reused."""
        self.refresh_order_refs()
        ids = [n for n in (to_int(i.get("id")) for i in self.items) if n is not None]
        ids.extend(self.order_menu_ids)
        return max(ids, default=0) + 1

    def next_category_id(self) -> int:
        ids = [n for n in (to_int(c.get("id")) for c in self.categories) if n is not None]
        return max(ids, default=0) + 1

    def used_image_names(self, exclude_id: Any = None) -> set[str]:
        return {image_basename(i.get("image", "")).lower() for i in self.items
                if i.get("id") != exclude_id and i.get("image")}

    def unique_image_name(self, slug: str, exclude_id: Any, images_dir: str = "",
                          avoid_disk: bool = False, keep_name: str = "") -> str:
        """slug.jpg, or slug-2.jpg, slug-3.jpg ... if ANOTHER dish already uses the name."""
        slug = slug or "dish"
        used = self.used_image_names(exclude_id)
        n, name = 1, f"{slug}.jpg"
        while name.lower() in used or (
                avoid_disk and images_dir and name.lower() != keep_name.lower()
                and (Path(images_dir) / name).exists()):
            n += 1
            name = f"{slug}-{n}.jpg"
        return name

    # ---- validation ------------------------------------------------------
    def validate_all(self) -> tuple[list[str], list[str]]:
        """Return (blocking errors, non-blocking warnings) for the whole data set."""
        errors: list[str] = []
        warnings: list[str] = []
        cat_ids = {c.get("id") for c in self.categories}
        for c in self.categories:
            label = c.get("name") or c.get("nameAr") or f"Category #{c.get('id')}"
            if not str(c.get("name") or "").strip():
                errors.append(f"Category {label}: the English name is required.")
            if not str(c.get("nameAr") or "").strip():
                errors.append(f"Category {label}: the Arabic name is required.")
        images: dict[str, list[str]] = {}
        names: dict[tuple[Any, str], list[str]] = {}
        for it in self.items:
            errors.extend(validate_item(it, cat_ids))
            label = str(it.get("name") or "").strip() or f"Dish #{it.get('id')}"
            if it.get("image"):
                images.setdefault(image_basename(it["image"]).lower(), []).append(label)
            if str(it.get("name") or "").strip():
                key = (it.get("categoryId"), str(it["name"]).strip().lower())
                names.setdefault(key, []).append(label)
        for fn, labels in images.items():
            if len(labels) > 1:
                errors.append(f"Image file '{fn}' is used by more than one dish: {', '.join(labels)}.")
        for (cid, _), labels in names.items():
            if len(labels) > 1:
                cat = self.category_by_id(cid)
                warnings.append(f"Duplicate English name '{labels[0]}' in category "
                                f"'{cat.get('name') if cat else cid}' ({len(labels)} dishes).")
        return errors, warnings

    # ---- saving ----------------------------------------------------------
    def externally_modified(self) -> bool:
        try:
            return os.stat(self.path).st_mtime_ns != self.mtime_ns
        except OSError:
            return True

    def _make_backups(self) -> None:
        """db.backup.json (latest) plus up to 5 timestamped copies db.backup.YYYYMMDD-HHMMSS.json."""
        p = Path(self.path)
        folder, stem = p.parent, p.stem
        shutil.copy2(p, folder / f"{stem}.backup.json")
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        shutil.copy2(p, folder / f"{stem}.backup.{stamp}.json")
        pattern = re.compile(rf"^{re.escape(stem)}\.backup\.\d{{8}}-\d{{6}}\.json$")
        stamped = sorted(f for f in folder.iterdir() if pattern.match(f.name))
        for old in stamped[:-5]:
            try:
                old.unlink()
            except OSError:
                pass

    def save(self) -> None:
        """Merge categories/menuItems onto a FRESH read of the file and write it atomically."""
        disk = self.read_json(self.path)            # 1. fresh read
        merged = dict(disk)                         # 2. keep every other key as just read
        merged["categories"] = copy.deepcopy(self.categories)
        merged["menuItems"] = [order_item(copy.deepcopy(i)) for i in self.items]
        self._make_backups()                        # 3. backups before writing
        folder = Path(self.path).parent
        fd, tmp = tempfile.mkstemp(dir=folder, prefix=".db_tmp_", suffix=".json")
        try:                                        # 4. atomic write
            with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as fh:
                json.dump(merged, fh, indent=2, ensure_ascii=False)
                fh.flush()
                os.fsync(fh.fileno())
            os.replace(tmp, self.path)
        except Exception:
            try:
                os.unlink(tmp)
            except OSError:
                pass
            raise
        self.mtime_ns = os.stat(self.path).st_mtime_ns
        self.settings = disk.get("settings") if isinstance(disk.get("settings"), dict) else {}
        self.order_menu_ids = self.collect_order_ids(disk)


# --------------------------------------------------------------------------- #
# Arabic-aware input widgets and table delegates
# --------------------------------------------------------------------------- #
class ArabicLineEdit(QLineEdit):
    """Single-line input with right-to-left layout and an Arabic-capable font."""

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setLayoutDirection(Qt.RightToLeft)
        self.setAlignment(Qt.AlignRight)
        self.setFont(arabic_font())


class ArabicPlainTextEdit(QPlainTextEdit):
    """Multi-line input with right-to-left layout and right alignment."""

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setLayoutDirection(Qt.RightToLeft)
        self.setFont(arabic_font())
        opt = self.document().defaultTextOption()
        opt.setTextDirection(Qt.RightToLeft)
        opt.setAlignment(Qt.AlignRight)
        self.document().setDefaultTextOption(opt)


class ArabicDelegate(QStyledItemDelegate):
    """Cell editor for Arabic text inside tables."""

    def createEditor(self, parent: QWidget, option: Any, index: Any) -> QWidget:
        editor = ArabicLineEdit(parent)
        return editor


class PriceDelegate(QStyledItemDelegate):
    """Cell editor for non-negative prices."""

    def createEditor(self, parent: QWidget, option: Any, index: Any) -> QWidget:
        sp = QDoubleSpinBox(parent)
        sp.setRange(0, 100000)
        sp.setDecimals(2)
        sp.setSingleStep(1)
        return sp

    def setEditorData(self, editor: QWidget, index: Any) -> None:
        try:
            editor.setValue(float(index.data(Qt.EditRole) or 0))  # type: ignore[attr-defined]
        except (TypeError, ValueError):
            editor.setValue(0)  # type: ignore[attr-defined]

    def setModelData(self, editor: QWidget, model: Any, index: Any) -> None:
        editor.interpretText()  # type: ignore[attr-defined]
        model.setData(index, fmt_num(editor.value()), Qt.EditRole)  # type: ignore[attr-defined]


# --------------------------------------------------------------------------- #
# Extras table
# --------------------------------------------------------------------------- #
class ExtrasTable(QWidget):
    """Editable table of extras: Name, Arabic name, Price (+ Add / Remove)."""

    changed = Signal()

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self._loading = False
        self.table = QTableWidget(0, 3)
        self.table.setHorizontalHeaderLabels(["Name", "Arabic name", "Price"])
        hdr = self.table.horizontalHeader()
        hdr.setSectionResizeMode(0, QHeaderView.Stretch)
        hdr.setSectionResizeMode(1, QHeaderView.Stretch)
        hdr.setSectionResizeMode(2, QHeaderView.Fixed)
        self.table.setColumnWidth(2, 90)
        self.table.verticalHeader().setVisible(False)
        self.table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SingleSelection)
        self.table.setItemDelegateForColumn(1, ArabicDelegate(self.table))
        self.table.setItemDelegateForColumn(2, PriceDelegate(self.table))
        self.table.setMinimumHeight(130)
        self.table.itemChanged.connect(self._on_item_changed)

        self.btn_add = QPushButton("Add extra")
        self.btn_remove = QPushButton("Remove")
        self.btn_add.clicked.connect(self.add_row)
        self.btn_remove.clicked.connect(self.remove_row)
        buttons = QHBoxLayout()
        buttons.addWidget(self.btn_add)
        buttons.addWidget(self.btn_remove)
        buttons.addStretch(1)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.table)
        layout.addLayout(buttons)

    def _on_item_changed(self, _item: QTableWidgetItem) -> None:
        if not self._loading:
            self.changed.emit()

    def _set_row(self, row: int, name: str, name_ar: str, price: str) -> None:
        it0 = QTableWidgetItem(name)
        it1 = QTableWidgetItem(name_ar)
        it1.setTextAlignment(Qt.AlignRight | Qt.AlignVCenter)
        it1.setFont(arabic_font())
        it2 = QTableWidgetItem(price)
        it2.setTextAlignment(Qt.AlignRight | Qt.AlignVCenter)
        self.table.setItem(row, 0, it0)
        self.table.setItem(row, 1, it1)
        self.table.setItem(row, 2, it2)

    def set_extras(self, extras: list[dict[str, Any]]) -> None:
        self._loading = True
        self.table.setRowCount(0)
        for e in extras:
            row = self.table.rowCount()
            self.table.insertRow(row)
            p = e.get("price", 0)
            self._set_row(row, str(e.get("name", "")), str(e.get("nameAr", "")),
                          fmt_num(p) if is_number(p) else str(p))
        self._loading = False

    def get_extras(self) -> list[dict[str, Any]]:
        """Current extras. Price is None when the cell is not a valid number."""
        out: list[dict[str, Any]] = []
        for row in range(self.table.rowCount()):
            def text(col: int) -> str:
                it = self.table.item(row, col)
                return it.text().strip() if it else ""
            try:
                price: Optional[float] = float(text(2).replace(",", "."))
                price = num_out(price)
            except ValueError:
                price = None
            out.append({"name": text(0), "nameAr": text(1), "price": price})
        return out

    def add_row(self) -> None:
        row = self.table.rowCount()
        self._loading = True
        self.table.insertRow(row)
        self._set_row(row, "", "", "0")
        self._loading = False
        self.table.setCurrentCell(row, 0)
        self.table.editItem(self.table.item(row, 0))
        self.changed.emit()

    def remove_row(self) -> None:
        row = self.table.currentRow()
        if row >= 0:
            self.table.removeRow(row)
            self.changed.emit()


# --------------------------------------------------------------------------- #
# Crop widget + dialog
# --------------------------------------------------------------------------- #
class CropWidget(QWidget):
    """Shows an image scaled to fit with a crop rectangle of LOCKED aspect ratio.

    The rectangle lives in ORIGINAL image coordinates (so the final crop is taken from the
    full-resolution image).  Drag inside = move, drag a corner = resize (ratio kept, stays
    inside the image), mouse wheel = enlarge / shrink around the centre.
    """

    changed = Signal()
    HANDLE = 8

    def __init__(self, display: QImage, orig_size: tuple[int, int], ratio: float,
                 parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.pix = QPixmap.fromImage(display)
        self.iw, self.ih = orig_size
        self.ratio = ratio
        self.min_w = float(min(30, self.iw, self.ih * ratio))
        self.max_w = float(min(self.iw, self.ih * ratio))
        self.cw = self.max_w
        self.ch = self.cw / ratio
        self.cx = (self.iw - self.cw) / 2
        self.cy = (self.ih - self.ch) / 2
        self._mode = ""
        self._corner = ""
        self._anchor = (0.0, 0.0)
        self._grab = (0.0, 0.0)
        self.setMouseTracking(True)
        self.setMinimumSize(480, 380)
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

    # ---- coordinate mapping ---------------------------------------------
    def _scale_offset(self) -> tuple[float, float, float]:
        m = 8
        s = min(max(1, self.width() - 2 * m) / self.iw, max(1, self.height() - 2 * m) / self.ih)
        return s, (self.width() - self.iw * s) / 2, (self.height() - self.ih * s) / 2

    def _to_widget(self, x: float, y: float) -> QPointF:
        s, ox, oy = self._scale_offset()
        return QPointF(ox + x * s, oy + y * s)

    def _to_image(self, p: QPointF) -> tuple[float, float]:
        s, ox, oy = self._scale_offset()
        return (p.x() - ox) / s, (p.y() - oy) / s

    def _rect_widget(self) -> QRectF:
        return QRectF(self._to_widget(self.cx, self.cy), self._to_widget(self.cx + self.cw, self.cy + self.ch))

    def _corners(self) -> dict[str, QPointF]:
        return {
            "tl": self._to_widget(self.cx, self.cy),
            "tr": self._to_widget(self.cx + self.cw, self.cy),
            "bl": self._to_widget(self.cx, self.cy + self.ch),
            "br": self._to_widget(self.cx + self.cw, self.cy + self.ch),
        }

    def _corner_at(self, pos: QPointF) -> str:
        for name, pt in self._corners().items():
            if abs(pt.x() - pos.x()) <= self.HANDLE + 3 and abs(pt.y() - pos.y()) <= self.HANDLE + 3:
                return name
        return ""

    def crop_box(self) -> tuple[int, int, int, int]:
        """Crop rectangle (left, top, right, bottom) in original-image pixels."""
        left = int(round(self.cx))
        top = int(round(self.cy))
        right = min(self.iw, max(left + 1, left + int(round(self.cw))))
        bottom = min(self.ih, max(top + 1, top + int(round(self.ch))))
        return left, top, right, bottom

    # ---- painting --------------------------------------------------------
    def paintEvent(self, _event: Any) -> None:
        p = QPainter(self)
        p.setRenderHint(QPainter.SmoothPixmapTransform)
        p.fillRect(self.rect(), QColor("#2b2d31"))
        s, ox, oy = self._scale_offset()
        img_rect = QRectF(ox, oy, self.iw * s, self.ih * s)
        p.drawPixmap(img_rect, self.pix, QRectF(self.pix.rect()))
        crop = self._rect_widget()
        shade = QPainterPath()
        shade.addRect(img_rect)
        hole = QPainterPath()
        hole.addRect(crop)
        p.fillPath(shade.subtracted(hole), QColor(0, 0, 0, 150))
        p.setPen(QPen(QColor("white"), 2))
        p.setBrush(Qt.NoBrush)
        p.drawRect(crop)
        p.setPen(QPen(QColor(255, 255, 255, 90), 1))  # rule-of-thirds guides
        for k in (1, 2):
            p.drawLine(QPointF(crop.left() + crop.width() * k / 3, crop.top()),
                       QPointF(crop.left() + crop.width() * k / 3, crop.bottom()))
            p.drawLine(QPointF(crop.left(), crop.top() + crop.height() * k / 3),
                       QPointF(crop.right(), crop.top() + crop.height() * k / 3))
        p.setPen(QPen(QColor("#2563eb"), 1))
        p.setBrush(QBrush(QColor("white")))
        for pt in self._corners().values():
            p.drawRect(QRectF(pt.x() - self.HANDLE / 2, pt.y() - self.HANDLE / 2, self.HANDLE, self.HANDLE))
        p.end()

    # ---- interaction -----------------------------------------------------
    def mousePressEvent(self, e: Any) -> None:
        if e.button() != Qt.LeftButton:
            return
        pos = e.position()
        corner = self._corner_at(pos)
        if corner:
            self._mode, self._corner = "resize", corner
            ax = self.cx + (0 if "r" in corner else self.cw)   # anchor = opposite corner
            ay = self.cy + (0 if "b" in corner else self.ch)
            self._anchor = (ax, ay)
        elif self._rect_widget().contains(pos):
            self._mode = "move"
            ix, iy = self._to_image(pos)
            self._grab = (ix - self.cx, iy - self.cy)
            self.setCursor(Qt.ClosedHandCursor)

    def mouseMoveEvent(self, e: Any) -> None:
        pos = e.position()
        if not (e.buttons() & Qt.LeftButton) or not self._mode:
            corner = self._corner_at(pos)
            if corner in ("tl", "br"):
                self.setCursor(Qt.SizeFDiagCursor)
            elif corner in ("tr", "bl"):
                self.setCursor(Qt.SizeBDiagCursor)
            elif self._rect_widget().contains(pos):
                self.setCursor(Qt.OpenHandCursor)
            else:
                self.setCursor(Qt.ArrowCursor)
            return
        px, py = self._to_image(pos)
        if self._mode == "move":
            self.cx = min(max(0.0, px - self._grab[0]), self.iw - self.cw)
            self.cy = min(max(0.0, py - self._grab[1]), self.ih - self.ch)
        else:  # resize, ratio locked, anchored on the opposite corner
            ax, ay = self._anchor
            sx = 1 if "r" in self._corner else -1
            sy = 1 if "b" in self._corner else -1
            w = max((px - ax) * sx, (py - ay) * sy * self.ratio)
            max_x = self.iw - ax if sx > 0 else ax
            max_y = self.ih - ay if sy > 0 else ay
            w_max = min(max_x, max_y * self.ratio)
            w = max(min(self.min_w, w_max), min(w, w_max))
            self.cw, self.ch = w, w / self.ratio
            self.cx = ax if sx > 0 else ax - self.cw
            self.cy = ay if sy > 0 else ay - self.ch
        self.update()
        self.changed.emit()

    def mouseReleaseEvent(self, _e: Any) -> None:
        self._mode = ""
        self.setCursor(Qt.ArrowCursor)

    def wheelEvent(self, e: Any) -> None:
        steps = e.angleDelta().y() / 120.0
        if steps == 0:
            return
        centre_x, centre_y = self.cx + self.cw / 2, self.cy + self.ch / 2
        new_w = min(self.max_w, max(self.min_w, self.cw * (1.08 ** steps)))
        self.cw, self.ch = new_w, new_w / self.ratio
        self.cx = min(max(0.0, centre_x - self.cw / 2), self.iw - self.cw)
        self.cy = min(max(0.0, centre_y - self.ch / 2), self.ih - self.ch)
        self.update()
        self.changed.emit()


class CropDialog(QDialog):
    """Dialog with the crop widget on the left and a live preview of the result on the right."""

    def __init__(self, image: Image.Image, ratio: float, out_size: tuple[int, int],
                 parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Crop image")
        self.resize(980, 600)
        self.image = image
        self.out_size = out_size
        iw, ih = image.size
        # Downscaled copies for fast display / live preview only. The final crop is taken
        # from the full-resolution `image` by the caller.
        display = image.copy()
        display.thumbnail((1600, 1600), RESAMPLE.LANCZOS)
        self.preview_src = image.copy()
        self.preview_src.thumbnail((1000, 1000), RESAMPLE.BILINEAR)
        self.crop = CropWidget(pil_to_qimage(display), (iw, ih), ratio)
        self.crop.changed.connect(self._update_preview)

        pw, ph = (300, round(300 / ratio)) if ratio >= 1 else (round(300 * ratio), 300)
        self.preview = QLabel()
        self.preview.setFixedSize(pw, ph)
        self.preview.setAlignment(Qt.AlignCenter)
        set_role(self.preview, "frame")
        self._pw, self._ph = pw, ph
        self.info = QLabel()
        self.info.setWordWrap(True)
        hint = QLabel("Drag inside the frame to move it.\nDrag a corner to resize (ratio locked).\n"
                      "Use the mouse wheel to enlarge or shrink.")
        set_role(hint, "muted")
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)

        side = QVBoxLayout()
        side.addWidget(QLabel("<b>Preview</b>"))
        side.addWidget(self.preview)
        side.addWidget(self.info)
        side.addSpacing(8)
        side.addWidget(hint)
        side.addStretch(1)
        side.addWidget(buttons)
        root = QHBoxLayout(self)
        root.addWidget(self.crop, 1)
        root.addLayout(side)
        self._update_preview()

    def crop_box(self) -> tuple[int, int, int, int]:
        return self.crop.crop_box()

    def _update_preview(self) -> None:
        l, t, r, b = self.crop.crop_box()
        f = self.preview_src.width / self.image.width
        box = (int(l * f), int(t * f), max(int(l * f) + 1, int(r * f)), max(int(t * f) + 1, int(b * f)))
        small = self.preview_src.crop(box).resize((self._pw, self._ph), RESAMPLE.BILINEAR)
        self.preview.setPixmap(QPixmap.fromImage(pil_to_qimage(small)))
        self.info.setText(f"Crop: {r - l} x {b - t} px (from {self.image.width} x {self.image.height})\n"
                          f"Output: {self.out_size[0]} x {self.out_size[1]} px")


# --------------------------------------------------------------------------- #
# Settings dialog
# --------------------------------------------------------------------------- #
class SettingsDialog(QDialog):
    """Paths, crop aspect ratio, output width and JPEG quality."""

    PRESETS = [("4:3", (4, 3)), ("1:1", (1, 1)), ("16:9", (16, 9)), ("3:2", (3, 2))]

    def __init__(self, config: AppConfig, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Settings")
        self.setMinimumWidth(560)
        self.config = config

        self.db_edit = QLineEdit(config.db_path)
        self.img_edit = QLineEdit(config.images_dir)
        btn_db = QPushButton("Browse...")
        btn_img = QPushButton("Browse...")
        btn_db.clicked.connect(self._browse_db)
        btn_img.clicked.connect(self._browse_images)

        self.preset = QComboBox()
        for label, _ in self.PRESETS:
            self.preset.addItem(label)
        self.preset.addItem("Custom")
        self.aw = QSpinBox()
        self.ah = QSpinBox()
        for sp in (self.aw, self.ah):
            sp.setRange(1, 100)
        self.aw.setValue(config.aspect_w)
        self.ah.setValue(config.aspect_h)
        current = (config.aspect_w, config.aspect_h)
        idx = next((i for i, (_, v) in enumerate(self.PRESETS) if v == current), len(self.PRESETS))
        self.preset.setCurrentIndex(idx)
        self.preset.currentIndexChanged.connect(self._on_preset)
        self.aw.valueChanged.connect(self._update_height)
        self.ah.valueChanged.connect(self._update_height)

        self.width_spin = QSpinBox()
        self.width_spin.setRange(50, 4000)
        self.width_spin.setSuffix(" px")
        self.width_spin.setValue(config.out_width)
        self.width_spin.valueChanged.connect(self._update_height)
        self.height_label = QLabel()
        self.quality = QSpinBox()
        self.quality.setRange(1, 100)
        self.quality.setValue(config.jpeg_quality)
        self.theme_combo = QComboBox()
        for label, key in (("System default", "system"), ("Light", "light"), ("Dark", "dark")):
            self.theme_combo.addItem(label, key)
        self.theme_combo.setCurrentIndex(max(0, self.theme_combo.findData(config.theme)))

        grid = QFormLayout()
        row = QHBoxLayout()
        row.addWidget(self.db_edit, 1)
        row.addWidget(btn_db)
        grid.addRow("db.json path:", row)
        row = QHBoxLayout()
        row.addWidget(self.img_edit, 1)
        row.addWidget(btn_img)
        grid.addRow("Images folder:", row)
        ratio_row = QHBoxLayout()
        ratio_row.addWidget(self.preset)
        ratio_row.addWidget(self.aw)
        ratio_row.addWidget(QLabel(":"))
        ratio_row.addWidget(self.ah)
        ratio_row.addStretch(1)
        grid.addRow("Crop aspect ratio:", ratio_row)
        grid.addRow("Output width:", self.width_spin)
        grid.addRow("Output height:", self.height_label)
        grid.addRow("JPEG quality:", self.quality)
        grid.addRow("Theme:", self.theme_combo)

        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(self._accept)
        buttons.rejected.connect(self.reject)
        layout = QVBoxLayout(self)
        layout.addLayout(grid)
        layout.addWidget(buttons)
        self._on_preset()

    def _on_preset(self) -> None:
        i = self.preset.currentIndex()
        custom = i >= len(self.PRESETS)
        if not custom:
            w, h = self.PRESETS[i][1]
            self.aw.setValue(w)
            self.ah.setValue(h)
        self.aw.setEnabled(custom)
        self.ah.setEnabled(custom)
        self._update_height()

    def _update_height(self) -> None:
        h = max(1, round(self.width_spin.value() * self.ah.value() / self.aw.value()))
        self.height_label.setText(f"{h} px (derived from the ratio)")

    def _browse_db(self) -> None:
        start = self.db_edit.text() or str(Path.home())
        path, _ = QFileDialog.getOpenFileName(self, "Select db.json", start, "JSON files (*.json);;All files (*)")
        if path:
            self.db_edit.setText(os.path.normpath(path))

    def _browse_images(self) -> None:
        start = self.img_edit.text() or str(Path.home())
        path = QFileDialog.getExistingDirectory(self, "Select images folder", start)
        if path:
            self.img_edit.setText(os.path.normpath(path))

    def _accept(self) -> None:
        db = self.db_edit.text().strip().strip('"')
        img = self.img_edit.text().strip().strip('"')
        if not db or not os.path.isfile(db):
            msg_info(self, "Settings", "Please choose an existing db.json file.", icon=QMessageBox.Warning)
            return
        if not img:
            msg_info(self, "Settings", "Please choose the images folder.", icon=QMessageBox.Warning)
            return
        if not os.path.isdir(img):
            if not confirm(self, "Settings", f"The folder does not exist:\n{img}\n\nCreate it?", True):
                return
            try:
                os.makedirs(img, exist_ok=True)
            except OSError as exc:
                msg_error(self, "Settings", f"Could not create the folder: {exc}")
                return
        self.config.db_path = os.path.normpath(db)
        self.config.images_dir = os.path.normpath(img)
        self.config.aspect_w = self.aw.value()
        self.config.aspect_h = self.ah.value()
        self.config.out_width = self.width_spin.value()
        self.config.jpeg_quality = self.quality.value()
        self.config.theme = str(self.theme_combo.currentData())
        self.accept()


# --------------------------------------------------------------------------- #
# Category dialog and panel
# --------------------------------------------------------------------------- #
class CategoryDialog(QDialog):
    """Add / edit a category (English + Arabic name)."""

    def __init__(self, name: str = "", name_ar: str = "", parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Category")
        self.setMinimumWidth(380)
        self.name_edit = QLineEdit(name)
        self.name_ar_edit = ArabicLineEdit()
        self.name_ar_edit.setText(name_ar)
        form = QFormLayout()
        form.addRow("Name (English):", self.name_edit)
        form.addRow("Name (Arabic):", self.name_ar_edit)
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(self._accept)
        buttons.rejected.connect(self.reject)
        layout = QVBoxLayout(self)
        layout.addLayout(form)
        layout.addWidget(buttons)

    def _accept(self) -> None:
        if not self.name_edit.text().strip() or not self.name_ar_edit.text().strip():
            msg_info(self, "Category", "Both the English and the Arabic name are required.",
                     icon=QMessageBox.Warning)
            return
        self.accept()

    def values(self) -> tuple[str, str]:
        return self.name_edit.text().strip(), self.name_ar_edit.text().strip()


class CategoryPanel(QWidget):
    """Left panel: 'All dishes' + categories with dish counts.

    Add / Edit / Delete / Move up / Move down are available as buttons, from the right-click
    menu, and double-clicking a category opens the edit dialog.
    """

    selection_changed = Signal()
    add_clicked = Signal()
    edit_clicked = Signal()
    delete_clicked = Signal()
    move_clicked = Signal(int)  # -1 up, +1 down

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.list = QListWidget()
        self.list.currentRowChanged.connect(self._on_row)
        self.list.itemDoubleClicked.connect(lambda _i: self.edit_clicked.emit())
        self.list.setContextMenuPolicy(Qt.CustomContextMenu)
        self.list.customContextMenuRequested.connect(self._context_menu)
        self.btn_add = QPushButton("+ Add category")
        self.btn_edit = QPushButton("Rename / Edit")
        self.btn_delete = QPushButton("Delete")
        self.btn_up = QPushButton("Move up")
        self.btn_down = QPushButton("Move down")
        self.btn_add.clicked.connect(self.add_clicked)
        self.btn_edit.clicked.connect(self.edit_clicked)
        self.btn_delete.clicked.connect(self.delete_clicked)
        self.btn_up.clicked.connect(lambda: self.move_clicked.emit(-1))
        self.btn_down.clicked.connect(lambda: self.move_clicked.emit(1))
        self.btn_add.setObjectName("primary")
        self.btn_edit.setToolTip("Edit the English and Arabic name (or double-click the category)")
        self.btn_up.setToolTip("Move the category up (changes the order on the site)")
        self.btn_down.setToolTip("Move the category down (changes the order on the site)")
        grid = QGridLayout()
        grid.addWidget(self.btn_add, 0, 0)
        grid.addWidget(self.btn_edit, 0, 1)
        grid.addWidget(self.btn_delete, 1, 0, 1, 2)
        grid.addWidget(self.btn_up, 2, 0)
        grid.addWidget(self.btn_down, 2, 1)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(QLabel("<b>Categories</b>"))
        layout.addWidget(self.list, 1)
        layout.addLayout(grid)
        self.update_buttons()

    def _on_row(self, _row: int) -> None:
        self.update_buttons()
        self.selection_changed.emit()

    def update_buttons(self) -> None:
        """Edit/Delete/Move only make sense for a real category (not 'All dishes')."""
        row = self.list.currentRow()
        real = row > 0
        self.btn_edit.setEnabled(real)
        self.btn_delete.setEnabled(real)
        self.btn_up.setEnabled(real and row > 1)
        self.btn_down.setEnabled(real and row < self.list.count() - 1)

    def _context_menu(self, pos: Any) -> None:
        item = self.list.itemAt(pos)
        if item is not None:
            self.list.setCurrentItem(item)
        menu = QMenu(self)
        for text, signal, enabled in (
                ("Add category...", self.add_clicked, True),
                ("Rename / Edit...", self.edit_clicked, self.btn_edit.isEnabled()),
                ("Delete...", self.delete_clicked, self.btn_delete.isEnabled()),
                ("Move up", lambda: self.move_clicked.emit(-1), self.btn_up.isEnabled()),
                ("Move down", lambda: self.move_clicked.emit(1), self.btn_down.isEnabled())):
            act = menu.addAction(text)
            act.setEnabled(enabled)
            act.triggered.connect(lambda _c=False, sig=signal: sig.emit() if hasattr(sig, "emit") else sig())
        menu.exec(self.list.mapToGlobal(pos))

    def selected_id(self) -> int:
        it = self.list.currentItem()
        return ALL_ID if it is None else int(it.data(Qt.UserRole))

    def populate(self, storage: Storage, select_id: int = ALL_ID) -> None:
        self.list.blockSignals(True)
        self.list.clear()
        all_item = QListWidgetItem(f"All dishes  ({len(storage.items)})")
        all_item.setData(Qt.UserRole, ALL_ID)
        self.list.addItem(all_item)
        for c in storage.categories:
            it = QListWidgetItem(f"{c.get('name', '')}  ({storage.count_in_category(c.get('id'))})\n"
                                 f"{c.get('nameAr', '')}")
            it.setData(Qt.UserRole, c.get("id"))
            it.setSizeHint(QSize(0, 48))
            it.setFont(arabic_font())
            self.list.addItem(it)
        row = 0
        for r in range(self.list.count()):
            if int(self.list.item(r).data(Qt.UserRole)) == select_id:
                row = r
        self.list.setCurrentRow(row)
        self.list.blockSignals(False)
        self.update_buttons()


# --------------------------------------------------------------------------- #
# Dish table (middle panel)
# --------------------------------------------------------------------------- #
class DishTable(QWidget):
    """Middle panel: searchable dish table with thumbnail / name / Arabic name / price / available."""

    dish_selected = Signal(int)
    filter_changed = Signal()
    add_clicked = Signal()
    duplicate_clicked = Signal()
    delete_clicked = Signal()
    move_clicked = Signal(int)  # -1 up, +1 down

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.search = QLineEdit()
        self.search.setPlaceholderText("Search by English or Arabic name...")
        self.search.setClearButtonEnabled(True)
        self.search.textChanged.connect(lambda _t: self.filter_changed.emit())

        self.table = QTableWidget(0, 5)
        self.table.setHorizontalHeaderLabels(["Image", "Name", "Arabic name", "Price", "Available"])
        self.table.setIconSize(QSize(56, 42))
        self.table.verticalHeader().setVisible(False)
        self.table.verticalHeader().setDefaultSectionSize(48)
        self.table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SingleSelection)
        self.table.setAlternatingRowColors(True)
        hdr = self.table.horizontalHeader()
        hdr.setSectionResizeMode(0, QHeaderView.Fixed)
        hdr.setSectionResizeMode(1, QHeaderView.Stretch)
        hdr.setSectionResizeMode(2, QHeaderView.Stretch)
        hdr.setSectionResizeMode(3, QHeaderView.ResizeToContents)
        hdr.setSectionResizeMode(4, QHeaderView.ResizeToContents)
        self.table.setColumnWidth(0, 70)
        self.table.itemSelectionChanged.connect(self._on_selection)

        self.btn_add = QPushButton("Add dish")
        self.btn_dup = QPushButton("Duplicate")
        self.btn_del = QPushButton("Delete dish")
        self.btn_up = QPushButton("Move up")
        self.btn_down = QPushButton("Move down")
        self.btn_add.clicked.connect(self.add_clicked)
        self.btn_dup.clicked.connect(self.duplicate_clicked)
        self.btn_del.clicked.connect(self.delete_clicked)
        self.btn_up.clicked.connect(lambda: self.move_clicked.emit(-1))
        self.btn_down.clicked.connect(lambda: self.move_clicked.emit(1))
        row = QHBoxLayout()
        for b in (self.btn_add, self.btn_dup, self.btn_del, self.btn_up, self.btn_down):
            row.addWidget(b)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(QLabel("<b>Dishes</b>"))
        layout.addWidget(self.search)
        layout.addWidget(self.table, 1)
        layout.addLayout(row)

    def _on_selection(self) -> None:
        rows = self.table.selectionModel().selectedRows()
        if rows:
            it = self.table.item(rows[0].row(), 1)
            if it is not None:
                self.dish_selected.emit(int(it.data(Qt.UserRole)))

    def visible_ids(self) -> list[int]:
        out = []
        for r in range(self.table.rowCount()):
            it = self.table.item(r, 1)
            if it is not None:
                out.append(int(it.data(Qt.UserRole)))
        return out

    def populate(self, storage: Storage, config: AppConfig, cat_id: int, current_id: Optional[int]) -> None:
        """Rebuild the rows for the category filter + search text and re-select `current_id`."""
        q = self.search.text().strip().lower()
        rows = [it for it in storage.items
                if (cat_id == ALL_ID or it.get("categoryId") == cat_id)
                and (not q or q in str(it.get("name", "")).lower() or q in str(it.get("nameAr", "")).lower())]
        self.table.blockSignals(True)
        self.table.clearSelection()
        self.table.setRowCount(len(rows))
        select_row = -1
        for r, it in enumerate(rows):
            image = it.get("image", "")
            file = Path(config.images_dir) / image_basename(image) if image and config.images_dir else None
            thumb = QTableWidgetItem()
            pix = thumbnail_for(file) if file else None
            if pix is not None:
                thumb.setIcon(pix)  # type: ignore[arg-type]
            else:
                thumb.setText("\u26A0")  # warning sign
                thumb.setForeground(QBrush(error_color()))
                thumb.setTextAlignment(Qt.AlignCenter)
                thumb.setToolTip("No image set" if not image else f"Image file not found:\n{file}")
            name = QTableWidgetItem((str(it.get("name", "")) or "(new dish)"))
            name.setData(Qt.UserRole, it.get("id"))
            name_ar = QTableWidgetItem(str(it.get("nameAr", "")))
            name_ar.setFont(arabic_font())
            name_ar.setTextAlignment(Qt.AlignRight | Qt.AlignVCenter)
            price = QTableWidgetItem(fmt_num(it["basePrice"]) if is_number(it.get("basePrice")) else "?")
            price.setTextAlignment(Qt.AlignRight | Qt.AlignVCenter)
            avail = QTableWidgetItem("Yes" if it.get("isAvailable") else "No")
            avail.setTextAlignment(Qt.AlignCenter)
            if not it.get("isAvailable"):
                avail.setForeground(QBrush(error_color()))
            if pix is None:
                name.setForeground(QBrush(error_color()))
            for col, cell in enumerate((thumb, name, name_ar, price, avail)):
                self.table.setItem(r, col, cell)
            if it.get("id") == current_id:
                select_row = r
        if select_row >= 0:
            self.table.selectRow(select_row)
        self.table.blockSignals(False)

    def reselect(self, dish_id: Optional[int]) -> None:
        """Programmatically select a dish row without emitting dish_selected."""
        self.table.blockSignals(True)
        self.table.clearSelection()
        for r in range(self.table.rowCount()):
            it = self.table.item(r, 1)
            if it is not None and it.data(Qt.UserRole) == dish_id:
                self.table.selectRow(r)
        self.table.blockSignals(False)


# --------------------------------------------------------------------------- #
# Dish form (right panel)
# --------------------------------------------------------------------------- #
class DishForm(QWidget):
    """Edit form for one dish. Edits are held in the widgets until Apply (or Save) is used."""

    edited = Signal()
    applied = Signal(int)
    new_category_requested = Signal()

    def __init__(self, storage: Storage, config: AppConfig, parent: Optional[QWidget] = None) -> None:
        super().__init__(parent)
        self.storage = storage
        self.config = config
        self._item: Optional[dict[str, Any]] = None
        self._loading = False
        self._dirty = False
        self._image = ""

        self.name_en = QLineEdit()
        self.name_ar = ArabicLineEdit()
        self.desc_en = QPlainTextEdit()
        self.desc_en.setFixedHeight(72)
        self.desc_ar = ArabicPlainTextEdit()
        self.desc_ar.setFixedHeight(72)
        self.price = QDoubleSpinBox()
        self.price.setRange(0, 100000)
        self.price.setSingleStep(1)
        self.price.setDecimals(2)
        self.category = QComboBox()
        self.category.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.btn_new_cat = QPushButton("+ New category")
        self.veg = QCheckBox("Vegetarian")
        self.avail = QCheckBox("Available")

        details = QGroupBox("Details")
        form = QFormLayout(details)
        form.addRow("Name (English):", self.name_en)
        form.addRow("Name (Arabic):", self.name_ar)
        form.addRow("Description (English):", self.desc_en)
        form.addRow("Description (Arabic):", self.desc_ar)
        form.addRow("Base price (medium):", self.price)
        cat_row = QHBoxLayout()
        cat_row.addWidget(self.category, 1)
        cat_row.addWidget(self.btn_new_cat)
        form.addRow("Category:", cat_row)
        flags = QHBoxLayout()
        flags.addWidget(self.veg)
        flags.addWidget(self.avail)
        flags.addStretch(1)
        form.addRow("", flags)

        sizes = QGroupBox("Available sizes")
        grid = QGridLayout(sizes)
        self.size_checks: dict[str, QCheckBox] = {}
        self.size_labels: dict[str, QLabel] = {}
        for r, s in enumerate(SIZES):
            cb = QCheckBox(SIZE_LABELS[s])
            lab = QLabel()
            lab.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            self.size_checks[s] = cb
            self.size_labels[s] = lab
            grid.addWidget(cb, r, 0)
            grid.addWidget(lab, r, 1)
            cb.toggled.connect(lambda _c, name=s: self._on_size_toggled(name))
        self.size_note = QLabel("Preview = base price x size multiplier (extras not included).")
        set_role(self.size_note, "muted")
        grid.addWidget(self.size_note, 3, 0, 1, 2)

        extras_box = QGroupBox("Extras")
        eb = QVBoxLayout(extras_box)
        self.extras = ExtrasTable()
        eb.addWidget(self.extras)

        image_box = QGroupBox("Image")
        ib = QVBoxLayout(image_box)
        self.img_preview = QLabel()
        self.img_preview.setFixedSize(240, 180)  # 4:3
        self.img_preview.setAlignment(Qt.AlignCenter)
        set_role(self.img_preview, "frame")
        self.img_path = QLabel()
        self.img_path.setWordWrap(True)
        self.img_path.setTextInteractionFlags(Qt.TextSelectableByMouse)
        self.btn_choose = QPushButton("Choose image...")
        self.btn_remove_img = QPushButton("Remove image")
        brow = QHBoxLayout()
        brow.addWidget(self.btn_choose)
        brow.addWidget(self.btn_remove_img)
        brow.addStretch(1)
        ib.addWidget(self.img_preview, 0, Qt.AlignHCenter)
        ib.addWidget(self.img_path)
        ib.addLayout(brow)

        inner = QWidget()
        iv = QVBoxLayout(inner)
        iv.addWidget(details)
        iv.addWidget(sizes)
        iv.addWidget(extras_box)
        iv.addWidget(image_box)
        iv.addStretch(1)
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)
        scroll.setWidget(inner)

        self.btn_apply = QPushButton("Apply changes")
        self.btn_apply.setObjectName("primary")
        self.btn_revert = QPushButton("Revert")
        self.dirty_label = QLabel("")
        set_role(self.dirty_label, "warn")
        bottom = QHBoxLayout()
        bottom.addWidget(self.dirty_label, 1)
        bottom.addWidget(self.btn_revert)
        bottom.addWidget(self.btn_apply)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(QLabel("<b>Edit dish</b>"))
        layout.addWidget(scroll, 1)
        layout.addLayout(bottom)

        # wiring
        for w in (self.name_en, self.name_ar):
            w.textChanged.connect(self._mark_dirty)
        for w in (self.desc_en, self.desc_ar):
            w.textChanged.connect(self._mark_dirty)
        self.price.valueChanged.connect(self._mark_dirty)
        self.price.valueChanged.connect(self._update_size_preview)
        self.category.currentIndexChanged.connect(self._mark_dirty)
        self.veg.toggled.connect(self._mark_dirty)
        self.avail.toggled.connect(self._mark_dirty)
        self.extras.changed.connect(self._mark_dirty)
        self.btn_choose.clicked.connect(self.choose_image)
        self.btn_new_cat.clicked.connect(self.new_category_requested)
        self.btn_remove_img.clicked.connect(self.remove_image)
        self.btn_apply.clicked.connect(self.apply)
        self.btn_revert.clicked.connect(self.revert)
        self.set_currency(storage.currency)
        self.load(None)

    # ---- state -----------------------------------------------------------
    def is_dirty(self) -> bool:
        return self._dirty

    def current_id(self) -> Optional[int]:
        return None if self._item is None else self._item.get("id")

    def set_currency(self, currency: str) -> None:
        self.price.setSuffix(f" {currency}")

    def set_categories(self, categories: list[dict[str, Any]]) -> None:
        """Refill the category combo, keeping the current choice if it still exists."""
        keep = self.category.currentData()
        self._loading = True
        self.category.clear()
        for c in categories:
            self.category.addItem(f"{c.get('name', '')}  /  {c.get('nameAr', '')}", c.get("id"))
        idx = self.category.findData(keep)
        self.category.setCurrentIndex(idx)
        self._loading = False

    def _mark_dirty(self, *_args: Any) -> None:
        if self._loading:
            return
        self._dirty = True
        self.dirty_label.setText("Unsaved changes in this dish")
        self.btn_apply.setEnabled(True)
        self.btn_revert.setEnabled(True)
        self.edited.emit()

    def _clear_dirty(self) -> None:
        self._dirty = False
        self.dirty_label.setText("")

    # ---- load / collect --------------------------------------------------
    def load(self, item: Optional[dict[str, Any]]) -> None:
        """Show `item` in the form (None = empty and disabled)."""
        self._loading = True
        self._item = item
        enabled = item is not None
        for w in (self.name_en, self.name_ar, self.desc_en, self.desc_ar, self.price, self.category,
                  self.veg, self.avail, self.extras, self.btn_choose, self.btn_remove_img,
                  self.btn_new_cat, self.btn_apply, self.btn_revert, *self.size_checks.values()):
            w.setEnabled(enabled)
        it = item or {}
        self.name_en.setText(str(it.get("name", "")))
        self.name_ar.setText(str(it.get("nameAr", "")))
        self.desc_en.setPlainText(str(it.get("description", "")))
        self.desc_ar.setPlainText(str(it.get("descriptionAr", "")))
        self.price.setValue(float(it["basePrice"]) if is_number(it.get("basePrice")) else 0.0)
        self.category.setCurrentIndex(self.category.findData(it.get("categoryId")))
        self.veg.setChecked(bool(it.get("isVegetarian", False)))
        self.avail.setChecked(bool(it.get("isAvailable", True)))
        sizes = it.get("availableSizes", []) if item else []
        for s in SIZES:
            self.size_checks[s].setChecked(s in sizes)
        self.extras.set_extras(it.get("extras", []))
        self._image = str(it.get("image", ""))
        self._loading = False
        self._clear_dirty()
        self._update_size_preview()
        self._update_image_widgets()

    def collect(self) -> dict[str, Any]:
        """Build a dish dict from the widgets (not yet validated or stored)."""
        data = copy.deepcopy(self._item) if self._item else {}
        data.update({
            "name": self.name_en.text().strip(),
            "nameAr": self.name_ar.text().strip(),
            "description": self.desc_en.toPlainText().strip(),
            "descriptionAr": self.desc_ar.toPlainText().strip(),
            "basePrice": num_out(self.price.value()),
            "image": self._image,
            "categoryId": self.category.currentData(),
            "isVegetarian": self.veg.isChecked(),
            "isAvailable": self.avail.isChecked(),
            "availableSizes": [s for s in SIZES if self.size_checks[s].isChecked()],
            "extras": self.extras.get_extras(),
        })
        # keep any unknown keys inside existing extras
        old_extras = (self._item or {}).get("extras", [])
        for i, e in enumerate(data["extras"]):
            if i < len(old_extras):
                for k, v in old_extras[i].items():
                    e.setdefault(k, v)
        return order_item(data)

    # ---- sizes -----------------------------------------------------------
    def _on_size_toggled(self, name: str) -> None:
        if not self._loading and not any(cb.isChecked() for cb in self.size_checks.values()):
            cb = self.size_checks[name]
            cb.blockSignals(True)
            cb.setChecked(True)  # at least one size must stay checked
            cb.blockSignals(False)
            self.size_note.setText("At least one size must stay checked.")
            set_role(self.size_note, "warn")
            return
        self.size_note.setText("Preview = base price x size multiplier (extras not included).")
        set_role(self.size_note, "muted")
        self._update_size_preview()
        self._mark_dirty()

    def _update_size_preview(self) -> None:
        mult = self.storage.multipliers()
        for s in SIZES:
            if self.size_checks[s].isChecked():
                self.size_labels[s].setText(
                    f"{price_for(self.price.value(), mult[s]):.2f} {self.storage.currency}   (x{mult[s]:g})")
            else:
                self.size_labels[s].setText("-")

    # ---- image workflow --------------------------------------------------
    def _image_file(self) -> Optional[Path]:
        if not self._image or not self.config.images_dir:
            return None
        return Path(self.config.images_dir) / image_basename(self._image)

    def _update_image_widgets(self) -> None:
        file = self._image_file()
        self.btn_remove_img.setEnabled(bool(self._image) and self._item is not None)
        if not self._image:
            self.img_preview.setPixmap(QPixmap())
            self.img_preview.setText("No image")
            self.img_path.setText("(no image set)")
            set_role(self.img_path, "muted")
            return
        pix = QPixmap(str(file)) if file and file.is_file() else QPixmap()
        if pix.isNull():
            self.img_preview.setPixmap(QPixmap())
            self.img_preview.setText("\u26A0 File not found")
            self.img_path.setText(f"{self._image}\nMissing: {file}")
            set_role(self.img_path, "error")
        else:
            self.img_preview.setPixmap(pix.scaled(self.img_preview.size(), Qt.KeepAspectRatio,
                                                  Qt.SmoothTransformation))
            self.img_path.setText(self._image)
            set_role(self.img_path, "")

    def choose_image(self) -> None:
        """Pick, crop, resize and save an image named after the dish (see module spec)."""
        name = self.name_en.text().strip()
        if not name:
            msg_info(self, "Image", "Please type the dish's English name first.\n"
                     "The image file is named after it.", icon=QMessageBox.Warning)
            self.name_en.setFocus()
            return
        images_dir = self.config.images_dir
        if not images_dir or not os.path.isdir(images_dir):
            msg_error(self, "Image", "The images folder is not set or does not exist. Check Settings.")
            return
        path, _ = QFileDialog.getOpenFileName(self, "Choose an image", str(Path.home()),
                                              "Images (*.png *.jpg *.jpeg *.webp *.bmp)")
        if not path:
            return
        try:
            original = load_pil_image(path)
        except Exception as exc:  # noqa: BLE001 - any decoding problem is reported to the user
            msg_error(self, "Image", f"Could not open this image:\n{exc}")
            return
        out_size = (self.config.out_width, self.config.out_height)
        dlg = CropDialog(original, self.config.ratio, out_size, self)
        if dlg.exec() != QDialog.Accepted:
            return
        item_id = self.current_id()
        filename = self.storage.unique_image_name(slugify(name), item_id)
        target = Path(images_dir) / filename
        if target.exists() and not confirm(
                self, "Overwrite image",
                f"'{filename}' already exists in the images folder.\nOverwrite it?"):
            return
        try:
            # crop from the ORIGINAL full-resolution image, then resize with LANCZOS
            cropped = original.crop(dlg.crop_box()).resize(out_size, RESAMPLE.LANCZOS)
            cropped.save(target, "JPEG", quality=self.config.jpeg_quality, optimize=True)
        except Exception as exc:  # noqa: BLE001
            msg_error(self, "Image", f"Could not save the image:\n{exc}")
            return
        self._image = f"/images/{filename}"
        self._update_image_widgets()
        self._mark_dirty()

    def remove_image(self) -> None:
        if self._image:
            self._image = ""
            self._update_image_widgets()
            self._mark_dirty()

    def _offer_image_rename(self, data: dict[str, Any]) -> None:
        """After an English-name change, offer to rename the image file to match the new slug."""
        current = image_basename(data.get("image", ""))
        src = Path(self.config.images_dir) / current
        if not current or not src.is_file():
            return
        new_name = self.storage.unique_image_name(slugify(data["name"]), data.get("id"),
                                                  self.config.images_dir, True, current)
        if new_name.lower() == current.lower():
            return
        if confirm(self, "Rename image",
                   f"The dish name changed. Rename the image file?\n\n{current}  ->  {new_name}",
                   default_yes=True):
            try:
                os.replace(src, Path(self.config.images_dir) / new_name)
            except OSError as exc:
                msg_error(self, "Rename image", f"Could not rename the file:\n{exc}\nThe old path is kept.")
                return
            data["image"] = f"/images/{new_name}"
            self._image = data["image"]
            self._update_image_widgets()

    # ---- apply / revert --------------------------------------------------
    def apply(self) -> bool:
        """Validate and write the form into the dish in the model. Returns True on success."""
        if self._item is None:
            return True
        data = self.collect()
        cat_ids = {c.get("id") for c in self.storage.categories}
        errors = validate_item(data, cat_ids)
        if errors:
            msg_info(self, "Cannot apply", "Please fix the following:\n\n- " + "\n- ".join(errors),
                     icon=QMessageBox.Warning)
            return False
        if data["name"] != self._item.get("name", "") and data["image"]:
            self._offer_image_rename(data)
        self._item.clear()
        self._item.update(order_item(data))
        self._clear_dirty()
        self.applied.emit(int(self._item["id"]))
        return True

    def revert(self) -> None:
        self.load(self._item)


# --------------------------------------------------------------------------- #
# Main window
# --------------------------------------------------------------------------- #
THEMES: dict[str, dict[str, Any]] = {
    "light": dict(dark=False, bg="#f5f6f8", panel="#ffffff", alt="#f8f9fb", border="#d5d9e0",
                  text="#1f2430", muted="#5b6270", input="#ffffff", hover="#eef2ff", sel="#dbeafe",
                  sel_text="#111111", header="#f1f3f7", primary="#2563eb", primary_hover="#1d4ed8",
                  primary_disabled="#9db8f2", warn="#b45309", error="#d32f2f",
                  disabled_text="#a0a6b2", disabled_bg="#f1f3f7", handle="#e3e6ec", frame_bg="#f1f3f7"),
    "dark": dict(dark=True, bg="#1b1e25", panel="#242831", alt="#2a2f3a", border="#3a404d",
                 text="#e6e8ee", muted="#9aa3b2", input="#1f232b", hover="#323847", sel="#27407a",
                 sel_text="#ffffff", header="#2c313c", primary="#3b82f6", primary_hover="#2563eb",
                 primary_disabled="#2a4170", warn="#fbbf24", error="#ef5350",
                 disabled_text="#6b7280", disabled_bg="#2a2e37", handle="#323847", frame_bg="#1f232b"),
}
_CURRENT_THEME = {"name": "light"}

STYLE_TEMPLATE = """
QMainWindow, QDialog { background: @bg@; }
QToolBar { background: @panel@; border-bottom: 1px solid @border@; spacing: 6px; padding: 4px; }
QToolButton { padding: 4px 10px; border-radius: 6px; color: @text@; }
QToolButton:hover { background: @hover@; }
QToolButton:checked { background: @sel@; color: @sel_text@; }
QMenuBar { background: @panel@; color: @text@; }
QMenuBar::item:selected { background: @hover@; }
QMenu { background: @panel@; color: @text@; border: 1px solid @border@; }
QMenu::item { padding: 5px 22px; }
QMenu::item:selected { background: @sel@; color: @sel_text@; }
QMenu::item:disabled { color: @disabled_text@; }
QToolTip { background: @panel@; color: @text@; border: 1px solid @border@; }
QGroupBox { border: 1px solid @border@; border-radius: 8px; margin-top: 14px; padding: 12px 8px 8px 8px;
            background: @panel@; font-weight: 600; color: @text@; }
QGroupBox::title { subcontrol-origin: margin; left: 12px; padding: 0 4px; }
QLineEdit, QPlainTextEdit { border: 1px solid @border@; border-radius: 6px; padding: 4px 6px;
    background: @input@; color: @text@; selection-background-color: @primary@; selection-color: #ffffff; }
QLineEdit:focus, QPlainTextEdit:focus { border: 1px solid @primary@; }
QPushButton { background: @panel@; color: @text@; border: 1px solid @border@; border-radius: 6px;
    padding: 5px 12px; }
QPushButton:hover { background: @hover@; }
QPushButton:disabled { color: @disabled_text@; background: @disabled_bg@; }
QPushButton#primary { background: @primary@; color: #ffffff; border: none; font-weight: 600; }
QPushButton#primary:hover { background: @primary_hover@; }
QPushButton#primary:disabled { background: @primary_disabled@; color: #cbd5e1; }
QTableWidget, QListWidget { background: @panel@; alternate-background-color: @alt@; color: @text@;
    border: 1px solid @border@; border-radius: 8px; gridline-color: @border@;
    selection-background-color: @sel@; selection-color: @sel_text@; }
QHeaderView::section { background: @header@; color: @text@; border: none;
    border-bottom: 1px solid @border@; padding: 6px; font-weight: 600; }
QTableCornerButton::section { background: @header@; border: none; }
QSplitter::handle { background: @handle@; }
QStatusBar { background: @panel@; color: @text@; border-top: 1px solid @border@; }
QLabel[role="muted"] { color: @muted@; }
QLabel[role="warn"] { color: @warn@; }
QLabel[role="error"] { color: @error@; }
QLabel[role="frame"] { border: 1px solid @border@; background: @frame_bg@; color: @muted@; }
"""


def tokens() -> dict[str, Any]:
    return THEMES[_CURRENT_THEME["name"]]


def error_color() -> QColor:
    """Red used for missing images / unavailable dishes (lighter in dark mode)."""
    return QColor(tokens()["error"])


def set_role(widget: QWidget, role: str) -> None:
    """Tag a widget with a style role ('muted', 'warn', 'error', 'frame' or '') and re-polish it."""
    widget.setProperty("role", role)
    widget.style().unpolish(widget)
    widget.style().polish(widget)


def resolve_theme(setting: str) -> str:
    """'light'/'dark' pass through; 'system' follows the OS colour scheme (Qt 6.5+)."""
    if setting in ("light", "dark"):
        return setting
    try:
        return "dark" if QApplication.styleHints().colorScheme() == Qt.ColorScheme.Dark else "light"
    except Exception:  # noqa: BLE001 - older Qt: no colour-scheme API
        return "light"


def build_palette(t: dict[str, Any]) -> QPalette:
    pal = QPalette()
    c = QColor
    for role, key in ((QPalette.Window, "bg"), (QPalette.WindowText, "text"), (QPalette.Base, "input"),
                      (QPalette.AlternateBase, "alt"), (QPalette.ToolTipBase, "panel"),
                      (QPalette.ToolTipText, "text"), (QPalette.Text, "text"), (QPalette.Button, "panel"),
                      (QPalette.ButtonText, "text"), (QPalette.Highlight, "primary"),
                      (QPalette.Link, "primary"), (QPalette.PlaceholderText, "muted")):
        pal.setColor(role, c(t[key]))
    pal.setColor(QPalette.HighlightedText, c("#ffffff"))
    pal.setColor(QPalette.BrightText, c("#ffffff"))
    for role in (QPalette.Text, QPalette.ButtonText, QPalette.WindowText):
        pal.setColor(QPalette.Disabled, role, c(t["disabled_text"]))
    return pal


def apply_theme(app: QApplication, setting: str) -> str:
    """Apply palette + stylesheet for 'system' / 'light' / 'dark'. Returns the theme actually used."""
    name = resolve_theme(setting)
    _CURRENT_THEME["name"] = name
    t = THEMES[name]
    style = STYLE_TEMPLATE
    for key, value in t.items():
        if isinstance(value, str):
            style = style.replace(f"@{key}@", value)
    app.setPalette(build_palette(t))
    app.setStyleSheet(style)
    return name


class MainWindow(QMainWindow):
    """Application window: toolbar, three-panel splitter, status bar and all orchestration."""

    def __init__(self, config: AppConfig, config_existed: bool) -> None:
        super().__init__()
        self.config = config
        self.storage = Storage()
        self.loaded = False
        self.model_dirty = False
        self.current_id: Optional[int] = None

        self.categories_panel = CategoryPanel()
        self.dishes = DishTable()
        self.form = DishForm(self.storage, self.config)

        splitter = QSplitter(Qt.Horizontal)
        splitter.addWidget(self.categories_panel)
        splitter.addWidget(self.dishes)
        splitter.addWidget(self.form)
        splitter.setStretchFactor(0, 0)
        splitter.setStretchFactor(1, 1)
        splitter.setStretchFactor(2, 1)
        splitter.setSizes([240, 560, 560])
        splitter.setChildrenCollapsible(False)
        holder = QWidget()
        hl = QHBoxLayout(holder)
        hl.setContentsMargins(10, 10, 10, 6)
        hl.addWidget(splitter)
        self.setCentralWidget(holder)
        self.status_path = QLabel("")
        self.statusBar().addPermanentWidget(self.status_path)
        self._build_actions()

        cp, dp, fp = self.categories_panel, self.dishes, self.form
        cp.selection_changed.connect(self._on_category_changed)
        cp.add_clicked.connect(self.add_category)
        cp.edit_clicked.connect(self.edit_category)
        cp.delete_clicked.connect(self.delete_category)
        cp.move_clicked.connect(self.move_category)
        dp.dish_selected.connect(self._on_dish_selected)
        dp.filter_changed.connect(self.refresh_table)
        dp.add_clicked.connect(self.add_dish)
        dp.duplicate_clicked.connect(self.duplicate_dish)
        dp.delete_clicked.connect(self.delete_dish)
        dp.move_clicked.connect(self.move_dish)
        fp.edited.connect(self.update_title)
        fp.applied.connect(self._on_applied)
        fp.new_category_requested.connect(self.new_category_from_form)

        self.resize(1440, 840)
        self.update_title()
        self._update_enabled()
        if config_existed and os.path.isfile(config.db_path):
            QTimer.singleShot(0, lambda: self.load_db(self.config.db_path))
        else:
            QTimer.singleShot(0, self.open_settings)  # first run: ask for the paths

    # ---- actions ---------------------------------------------------------
    def _build_actions(self) -> None:
        self.act_open = QAction("Open db.json", self)
        self.act_open.setShortcut(QKeySequence.Open)
        self.act_open.triggered.connect(self.open_file)
        self.act_save = QAction("Save", self)
        self.act_save.setShortcut(QKeySequence("Ctrl+S"))
        self.act_save.triggered.connect(self.save)
        self.act_reload = QAction("Reload", self)
        self.act_reload.setShortcut(QKeySequence("F5"))
        self.act_reload.triggered.connect(self.reload)
        self.act_settings = QAction("Settings", self)
        self.act_settings.triggered.connect(self.open_settings)
        self.act_dark = QAction("Dark mode", self)
        self.act_dark.setCheckable(True)
        self.act_dark.setChecked(_CURRENT_THEME["name"] == "dark")
        self.act_dark.setShortcut(QKeySequence("Ctrl+D"))
        self.act_dark.triggered.connect(self.toggle_dark)
        self.act_exit = QAction("Exit", self)
        self.act_exit.triggered.connect(self.close)
        menu = self.menuBar().addMenu("&File")
        for a in (self.act_open, self.act_save, self.act_reload, None, self.act_settings, None, self.act_exit):
            if a is None:
                menu.addSeparator()
            else:
                menu.addAction(a)
        view = self.menuBar().addMenu("&View")
        view.addAction(self.act_dark)
        bar = QToolBar("Main")
        bar.setMovable(False)
        for a in (self.act_open, self.act_save, self.act_reload, self.act_settings, self.act_dark):
            bar.addAction(a)
        self.addToolBar(bar)

    def _update_enabled(self) -> None:
        for w in (self.act_save, self.act_reload):
            w.setEnabled(self.loaded)
        for w in (self.categories_panel, self.dishes):
            w.setEnabled(self.loaded)
        self.form.setEnabled(self.loaded)

    def has_unsaved(self) -> bool:
        return self.model_dirty or self.form.is_dirty()

    def update_title(self) -> None:
        mark = "* " if self.has_unsaved() else ""
        where = f" - {os.path.basename(self.storage.path)}" if self.storage.path else ""
        self.setWindowTitle(f"{mark}{APP_NAME}{where}")

    def set_model_dirty(self, value: bool = True) -> None:
        self.model_dirty = value
        self.update_title()

    # ---- loading ---------------------------------------------------------
    def load_db(self, path: str) -> bool:
        try:
            self.storage.load(path)
        except FileNotFoundError:
            msg_error(self, "Open", f"File not found:\n{path}")
            return False
        except (ValueError, OSError) as exc:
            msg_error(self, "Open", f"Could not read this file:\n{path}", str(exc))
            return False
        self.loaded = True
        self.model_dirty = False
        self.current_id = None
        self.status_path.setText(path)
        self.form.set_currency(self.storage.currency)
        self.form.set_categories(self.storage.categories)
        self.form.load(None)
        self.refresh_categories()
        self.refresh_table()
        self._update_enabled()
        self.update_title()
        self.statusBar().showMessage(f"Loaded {len(self.storage.items)} dishes, "
                                     f"{len(self.storage.categories)} categories", 5000)
        return True

    def open_file(self) -> None:
        if not self.confirm_discard():
            return
        start = self.config.db_path or str(Path.home())
        path, _ = QFileDialog.getOpenFileName(self, "Open db.json", start, "JSON files (*.json);;All files (*)")
        if path and self.load_db(os.path.normpath(path)):
            self.config.db_path = os.path.normpath(path)
            self._save_config()

    def reload(self) -> None:
        if self.loaded and self.confirm_discard("Reload from disk?"):
            self.load_db(self.storage.path)

    def open_settings(self) -> None:
        cfg = AppConfig(**self.config.__dict__)
        dlg = SettingsDialog(cfg, self)
        if dlg.exec() != QDialog.Accepted:
            return
        path_changed = os.path.normcase(cfg.db_path) != os.path.normcase(self.storage.path)
        if path_changed and self.loaded and not self.confirm_discard("Open the new db.json?"):
            return
        self.config.__dict__.update(cfg.__dict__)
        self._save_config()
        self.refresh_theme()
        if path_changed or not self.loaded:
            self.load_db(self.config.db_path)
        else:
            self.refresh_table()  # images folder may have changed -> refresh thumbnails

    def toggle_dark(self, checked: bool) -> None:
        self.config.theme = "dark" if checked else "light"
        self._save_config()
        self.refresh_theme()

    def refresh_theme(self) -> None:
        """Re-apply the configured theme and repaint the parts that hold explicit colours."""
        name = apply_theme(QApplication.instance(), self.config.theme)  # type: ignore[arg-type]
        self.act_dark.blockSignals(True)
        self.act_dark.setChecked(name == "dark")
        self.act_dark.blockSignals(False)
        self.refresh_table()
        self.form._update_image_widgets()

    def _save_config(self) -> None:
        try:
            self.config.save()
        except OSError as exc:
            msg_error(self, "Settings", f"Could not save the settings:\n{exc}")

    def confirm_discard(self, question: str = "Discard unsaved changes?") -> bool:
        """True if there is nothing unsaved or the user agrees to discard it."""
        if not self.has_unsaved():
            return True
        return confirm(self, APP_NAME, f"There are unsaved changes.\n\n{question}")

    # ---- view refresh ----------------------------------------------------
    def refresh_categories(self) -> None:
        self.categories_panel.populate(self.storage, self.categories_panel.selected_id())

    def refresh_table(self) -> None:
        self.dishes.populate(self.storage, self.config, self.categories_panel.selected_id(), self.current_id)

    def _on_category_changed(self) -> None:
        self.refresh_table()

    # ---- selection & leaving the form ------------------------------------
    def leave_current(self) -> bool:
        """Resolve pending form edits (Apply / Discard / Cancel). True = OK to move on."""
        if not self.form.is_dirty():
            return True
        answer = ask3(self, "Unsaved dish changes",
                      "The dish has changes that were not applied.\nApply them before continuing?")
        if answer == "cancel":
            return False
        if answer == "yes":
            return self.form.apply()
        self.form.revert()
        return True

    def _on_dish_selected(self, dish_id: int) -> None:
        if dish_id == self.current_id:
            return
        if not self.leave_current():
            self.dishes.reselect(self.current_id)
            return
        self.set_current(dish_id)

    def set_current(self, dish_id: Optional[int]) -> None:
        self.current_id = dish_id
        self.form.load(self.storage.item_by_id(dish_id) if dish_id is not None else None)
        self.update_title()

    def _on_applied(self, dish_id: int) -> None:
        self.set_model_dirty(True)
        item = self.storage.item_by_id(dish_id)
        sel = self.categories_panel.selected_id()
        if item is not None and sel != ALL_ID and item.get("categoryId") != sel:
            sel = item.get("categoryId")  # dish moved to another category -> follow it
        self.categories_panel.populate(self.storage, sel)
        self.refresh_table()
        dup = [i for i in self.storage.items if i is not item and item is not None
               and i.get("categoryId") == item.get("categoryId")
               and str(i.get("name", "")).strip().lower() == str(item.get("name", "")).strip().lower()]
        if dup:
            self.statusBar().showMessage("Warning: another dish in this category has the same English name.", 8000)
        else:
            self.statusBar().showMessage("Dish updated (not saved to disk yet).", 4000)

    # ---- dishes ----------------------------------------------------------
    def add_dish(self) -> None:
        if not self.storage.categories:
            msg_info(self, "Add dish", "Create a category first.", icon=QMessageBox.Warning)
            return
        if not self.leave_current():
            return
        sel = self.categories_panel.selected_id()
        cat_id = sel if sel != ALL_ID else self.storage.categories[0].get("id")
        item = normalize_item({"id": self.storage.next_item_id(), "name": "", "nameAr": "",
                               "basePrice": 0, "image": "", "categoryId": cat_id,
                               "isVegetarian": False, "isAvailable": True})
        self.storage.items.append(item)
        self.set_model_dirty(True)
        self.set_current(item["id"])
        self.categories_panel.populate(self.storage, sel)
        self.refresh_table()
        self.form.name_en.setFocus()

    def duplicate_dish(self) -> None:
        src = self.storage.item_by_id(self.current_id)
        if src is None:
            return
        if not self.leave_current():
            return
        src = self.storage.item_by_id(self.current_id)
        assert src is not None
        new = copy.deepcopy(src)
        new["id"] = self.storage.next_item_id()
        new["name"] = f"{src.get('name', '')} (copy)".strip()
        new["nameAr"] = f"{src.get('nameAr', '')} (نسخة)".strip()
        new["image"] = ""  # image file names must be unique, so the copy needs its own image
        self.storage.items.insert(self.storage.items.index(src) + 1, new)
        self.set_model_dirty(True)
        self.set_current(new["id"])
        self.categories_panel.populate(self.storage, self.categories_panel.selected_id())
        self.refresh_table()
        self.statusBar().showMessage("Dish duplicated - choose a new image for the copy.", 6000)

    def delete_dish(self) -> None:
        item = self.storage.item_by_id(self.current_id)
        if item is None:
            return
        label = item.get("name") or f"Dish #{item.get('id')}"
        self.storage.refresh_order_refs()
        in_orders = to_int(item.get("id")) in self.storage.order_menu_ids
        if in_orders:
            box = QMessageBox(QMessageBox.Warning, "Dish in order history",
                              f"'{label}' appears in existing orders.\nDeleting it breaks the link with the order "
                              "history. It is safer to mark it as unavailable instead.", QMessageBox.NoButton, self)
            b_unavail = box.addButton("Mark as unavailable", QMessageBox.AcceptRole)
            b_delete = box.addButton("Delete anyway", QMessageBox.DestructiveRole)
            box.addButton("Cancel", QMessageBox.RejectRole)
            box.setDefaultButton(b_unavail)
            box.exec()
            clicked = box.clickedButton()
            if clicked is b_unavail:
                self.form.avail.setChecked(False)
                if self.form.apply():
                    self.statusBar().showMessage(f"'{label}' marked as unavailable.", 5000)
                return
            if clicked is not b_delete:
                return
        elif not confirm(self, "Delete dish", f"Delete '{label}'?"):
            return
        # optional image deletion (default: keep; never if another dish uses it)
        delete_file: Optional[Path] = None
        image = item.get("image", "")
        if image and self.config.images_dir:
            file = Path(self.config.images_dir) / image_basename(image)
            others = self.storage.used_image_names(item.get("id"))
            if file.is_file() and image_basename(image).lower() not in others:
                if confirm(self, "Delete image file", f"Also delete the image file '{file.name}'?\n\n"
                           "(The default is to keep it.)"):
                    delete_file = file
        self.storage.items.remove(item)
        if delete_file is not None:
            try:
                delete_file.unlink()
            except OSError as exc:
                msg_error(self, "Delete image", f"Could not delete the image file:\n{exc}")
        self.set_model_dirty(True)
        self.set_current(None)
        self.categories_panel.populate(self.storage, self.categories_panel.selected_id())
        self.refresh_table()

    def move_dish(self, direction: int) -> None:
        """Swap the dish with its visible neighbour; this changes the order in the array."""
        if self.current_id is None:
            return
        if not self.leave_current():
            return
        ids = self.dishes.visible_ids()
        if self.current_id not in ids:
            return
        pos = ids.index(self.current_id) + direction
        if not 0 <= pos < len(ids):
            return
        a = self.storage.item_by_id(self.current_id)
        b = self.storage.item_by_id(ids[pos])
        if a is None or b is None:
            return
        ia, ib = self.storage.items.index(a), self.storage.items.index(b)
        self.storage.items[ia], self.storage.items[ib] = b, a
        self.set_model_dirty(True)
        self.refresh_table()

    # ---- categories ------------------------------------------------------
    def _selected_category(self) -> Optional[dict[str, Any]]:
        sel = self.categories_panel.selected_id()
        return None if sel == ALL_ID else self.storage.category_by_id(sel)

    def add_category(self) -> Optional[dict[str, Any]]:
        dlg = CategoryDialog(parent=self)
        if dlg.exec() != QDialog.Accepted:
            return None
        name, name_ar = dlg.values()
        cat = {"id": self.storage.next_category_id(), "name": name, "nameAr": name_ar}
        self.storage.categories.append(cat)
        self.set_model_dirty(True)
        self.form.set_categories(self.storage.categories)
        self.categories_panel.populate(self.storage, cat["id"])
        self.refresh_table()
        return cat

    def new_category_from_form(self) -> None:
        """'+ New category' next to the dish's category combo: create it and pick it for the dish."""
        cat = self.add_category()
        if cat is not None:
            self.form.category.setCurrentIndex(self.form.category.findData(cat["id"]))

    def move_category(self, direction: int) -> None:
        """Swap the selected category with its neighbour (order = order on the site)."""
        cat = self._selected_category()
        if cat is None:
            return
        i = self.storage.categories.index(cat)
        j = i + direction
        if not 0 <= j < len(self.storage.categories):
            return
        cats = self.storage.categories
        cats[i], cats[j] = cats[j], cats[i]
        self.set_model_dirty(True)
        self.form.set_categories(cats)
        self.categories_panel.populate(self.storage, cat["id"])

    def edit_category(self) -> None:
        cat = self._selected_category()
        if cat is None:
            msg_info(self, "Edit category", "Select a category first ('All dishes' cannot be edited).")
            return
        dlg = CategoryDialog(cat.get("name", ""), cat.get("nameAr", ""), self)
        if dlg.exec() != QDialog.Accepted:
            return
        cat["name"], cat["nameAr"] = dlg.values()
        self.set_model_dirty(True)
        self.form.set_categories(self.storage.categories)
        self.categories_panel.populate(self.storage, cat["id"])

    def delete_category(self) -> None:
        cat = self._selected_category()
        if cat is None:
            msg_info(self, "Delete category", "Select a category first ('All dishes' cannot be deleted).")
            return
        if not self.leave_current():
            return
        count = self.storage.count_in_category(cat.get("id"))
        target: Optional[dict[str, Any]] = None
        if count == 0:
            if not confirm(self, "Delete category", f"Delete the category '{cat.get('name')}'?"):
                return
        else:
            others = [c for c in self.storage.categories if c is not cat]
            if not others:
                msg_info(self, "Delete category", "This is the only category and it still has dishes. "
                         "Create another category first.", icon=QMessageBox.Warning)
                return
            labels = [f"{c.get('name')}  /  {c.get('nameAr')}" for c in others]
            choice, ok = QInputDialog.getItem(
                self, "Delete category",
                f"'{cat.get('name')}' has {count} dish(es).\nMove them to which category before deleting it?",
                labels, 0, False)
            if not ok:
                return
            target = others[labels.index(choice)]
        if target is not None:
            for it in self.storage.items:
                if it.get("categoryId") == cat.get("id"):
                    it["categoryId"] = target.get("id")
        self.storage.categories.remove(cat)
        self.set_model_dirty(True)
        self.form.set_categories(self.storage.categories)
        if self.current_id is not None:  # category of the open dish may have changed
            self.form.load(self.storage.item_by_id(self.current_id))
        self.categories_panel.populate(self.storage, ALL_ID)
        self.refresh_table()

    # ---- saving ----------------------------------------------------------
    def save(self) -> bool:
        """Apply the form, validate everything, then merge-and-write db.json. True on success."""
        if not self.loaded:
            return False
        if self.form.is_dirty() and not self.form.apply():
            return False
        errors, warnings = self.storage.validate_all()
        if errors:
            msg_info(self, "Cannot save", "Saving is blocked until these problems are fixed:\n\n- "
                     + "\n- ".join(errors[:15]) + (f"\n... and {len(errors) - 15} more" if len(errors) > 15 else ""),
                     icon=QMessageBox.Warning)
            return False
        if warnings and not confirm(self, "Warnings", "\n".join(warnings[:10]) + "\n\nSave anyway?", True):
            return False
        if self.storage.externally_modified():
            if not confirm(self, "File changed on disk",
                           "db.json was modified outside this app since you opened it (the site/json-server "
                           "probably saved a new order or reservation).\n\nYour menu edits will still be merged "
                           "onto the latest data; orders, users and reservations are kept as they are now.\n\n"
                           "Continue saving?"):
                return False
        try:
            self.storage.save()
        except Exception as exc:  # noqa: BLE001 - never crash on I/O problems
            msg_error(self, "Save failed", "db.json could not be saved. Nothing was overwritten.", str(exc))
            return False
        self.set_model_dirty(False)
        self.form.set_currency(self.storage.currency)
        self.form._update_size_preview()
        self.statusBar().showMessage(f"Saved at {datetime.now().strftime('%H:%M:%S')}")
        return True

    def closeEvent(self, event: Any) -> None:
        if self.has_unsaved():
            answer = ask3(self, "Unsaved changes", "You have unsaved changes. Save before closing?",
                          yes="Save", no="Discard")
            if answer == "cancel" or (answer == "yes" and not self.save()):
                event.ignore()
                return
        event.accept()


def main() -> int:
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    app.setFont(QFont("Segoe UI", 10))
    config, existed = AppConfig.load()
    apply_theme(app, config.theme)
    window = MainWindow(config, existed)
    window.show()
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())