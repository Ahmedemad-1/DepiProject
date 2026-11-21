// Lists the dish photos that db.json points to but that do not exist yet in client/public.
// Run: npm run check:images   (see docs/dish-photos-checklist.md)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const db = JSON.parse(
  fs.readFileSync(path.join(here, "../../server/mock/db.json"), "utf8"),
);
const missing = db.menuItems.filter(
  (i) =>
    i.image &&
    i.image.startsWith("/") &&
    !fs.existsSync(path.join(here, "../public", i.image)),
);
const local = db.menuItems.filter((i) => i.image?.startsWith("/")).length;
console.log(`${local - missing.length} of ${local} local dish photos found.`);
for (const i of missing) console.log(`  missing: ${i.image}   (${i.name})`);
process.exit(0);
