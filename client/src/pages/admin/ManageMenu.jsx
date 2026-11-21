import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import DishForm from "../../components/DishForm.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import Img from "../../components/Img.jsx";
import Loader from "../../components/Loader.jsx";
import {
  createMenuItem,
  deleteMenuItem,
  getCategories,
  getMenuItems,
  updateMenuItem,
} from "../../services/api.js";
import { formatPrice } from "../../utils/formatPrice.js";

export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError("");
    Promise.all([getMenuItems(), getCategories()])
      .then(([menuItems, menuCategories]) => {
        setItems(menuItems);
        setCategories(menuCategories);
      })
      .catch(() => setLoadError("We couldn’t load the menu. Try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categoryName = useCallback(
    (id) =>
      categories.find((category) => category.id === Number(id))?.name || "—",
    [categories],
  );
  const shownItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        (categoryFilter === "all" ||
          String(item.categoryId) === categoryFilter) &&
        `${item.name} ${item.nameAr || ""} ${categoryName(item.categoryId)}`
          .toLowerCase()
          .includes(query),
    );
  }, [items, categoryName, search, categoryFilter]);

  const availableCount = items.filter((item) => item.isAvailable).length;
  const unavailableCount = items.length - availableCount;

  function openNewForm() {
    setEditing(null);
    setActionError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditing(item);
    setActionError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function saveDish(values) {
    setSaving(true);
    setActionError("");
    try {
      if (editing) await updateMenuItem(editing.id, values);
      else await createMenuItem(values);
      setFormOpen(false);
      setEditing(null);
      setSuccess(editing ? "Dish updated." : "Dish added.");
      load();
    } catch {
      setActionError(
        "We couldn’t save this dish. Check the fields and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(item) {
    setActionError("");
    setSuccess("");
    try {
      await updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      setSuccess(
        `${item.name} is now ${item.isAvailable ? "unavailable" : "available"}.`,
      );
      load();
    } catch {
      setActionError("We couldn’t update dish availability. Try again.");
    }
  }

  async function removeDish() {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      await deleteMenuItem(deleteTarget.id);
      setSuccess(`${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);
      load();
    } catch {
      setActionError("We couldn’t delete this dish. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main id="main">
      <section className="page-head admin-head admin-management-head">
        <div className="container admin-head-content">
          <p className="tag">Menu studio</p>
          <h1>Manage menu</h1>
          <p className="lead">
            Keep every dish ready for service. Update details and control what
            guests can order.
          </p>
          <div className="admin-head-actions">
            <Link to="/admin" className="btn-ghost sm">
              Dashboard
            </Link>
            <button type="button" className="btn-solid" onClick={openNewForm}>
              <Plus size={16} aria-hidden="true" /> Add dish
            </button>
          </div>
        </div>
      </section>
      <section className="sec admin-dashboard admin-management-page">
        <div className="container">
          {actionError && (
            <p className="form-error admin-feedback" role="alert">
              {actionError}
            </p>
          )}
          {success && (
            <p className="admin-success" role="status">
              {success}
            </p>
          )}

          {formOpen && (
            <section
              className="form-card mb-4"
              aria-labelledby="dish-form-title"
            >
              <h2 id="dish-form-title" className="sm mb-4">
                {editing ? "Edit dish" : "Add a dish"}
              </h2>
              <DishForm
                key={editing?.id || "new-dish"}
                initialValues={editing || undefined}
                categories={categories}
                onSubmit={saveDish}
                onCancel={() => setFormOpen(false)}
                submitting={saving}
              />
            </section>
          )}

          <div className="admin-summary-row">
            <div>
              <p className="tag">Your menu</p>
              <h2 className="mb-0">{items.length} dishes</h2>
            </div>
            <div className="admin-summary-stats">
              <span>
                <i className="admin-dot is-available" />
                {availableCount} available
              </span>
              <span>
                <i className="admin-dot is-unavailable" />
                {unavailableCount} unavailable
              </span>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search field">
              <label htmlFor="menu-search">Search dishes</label>
              <div className="admin-search-input">
                <Search size={17} aria-hidden="true" />
                <input
                  id="menu-search"
                  className="form-control"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search dishes or categories"
                />
              </div>
            </div>
            <div className="field admin-category-filter">
              <label htmlFor="menu-category-filter">Category</label>
              <select
                id="menu-category-filter"
                className="form-control"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="admin-result-count mb-0" aria-live="polite">
              Showing {shownItems.length} of {items.length}
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : loadError ? (
            <ErrorMessage message={loadError} onRetry={load} />
          ) : shownItems.length === 0 ? (
            <div className="state">
              <h2 className="h4">No dishes found</h2>
              <p>Try another search or category, or add a new dish.</p>
            </div>
          ) : (
            <div className="row g-3 admin-dish-grid">
              {shownItems.map((item) => (
                <div className="col-sm-6 col-xl-4" key={item.id}>
                  <article
                    className={`admin-dish-card ${!item.isAvailable ? "is-off" : ""}`}
                  >
                    <div className="admin-dish-media">
                      <Img
                        src={item.imageSquare || item.image}
                        alt={item.name}
                        className="admin-dish-photo"
                      />
                      <span
                        className={`admin-availability ${item.isAvailable ? "is-available" : "is-unavailable"}`}
                      >
                        <i className="admin-dot" />
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="admin-dish-body">
                      <p className="admin-dish-category">
                        {categoryName(item.categoryId)}
                      </p>
                      <h3>{item.name}</h3>
                      <div className="admin-dish-price-row">
                        <span className="muted">Base price</span>
                        <strong>
                          {formatPrice(Number(item.basePrice) || 0)}
                        </strong>
                      </div>
                      <div className="admin-dish-actions">
                        <button
                          type="button"
                          className="btn-ghost sm"
                          onClick={() => openEditForm(item)}
                        >
                          <Pencil size={14} aria-hidden="true" /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn-ghost sm"
                          onClick={() => toggleAvailability(item)}
                        >
                          {item.isAvailable ? (
                            <EyeOff size={14} aria-hidden="true" />
                          ) : (
                            <Eye size={14} aria-hidden="true" />
                          )}
                          {item.isAvailable ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          className="admin-icon-action"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete this dish?"
        message="Deleting a dish can affect the menu history. Use Disable if it appears in past orders."
        confirmLabel="Delete dish"
        busy={deleting}
        onConfirm={removeDish}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
