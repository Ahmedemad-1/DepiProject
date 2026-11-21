# DEPI Graduation Project: Restaurant Website To-Do List

**Updated against the repository on Nov 21, 2026.** Login and Register were implemented on `feature/login-register`; they have not been run or tested yet.

Team: Ahmed Emad, Ahmed Taher, Shorouk, Heba Talaat

Stack in the repository: React 19 (Vite), Bootstrap, React Router, json-server 0.17.4. FastAPI + SQLite files exist as scaffolds, but the backend choice is still marked proposed in `CLAUDE.md` and the server README. Confirm the choice with Ahmed Emad before starting backend work.

Decisions in the repository: pickup only, small/medium/large sizes, optional extras, protected admin routes, English first with Arabic optional. The design is **Velora**; Nocturne is archived. Brand/contact details and opening hours still need team confirmation.

### Status key

- `[x]` Verified in the repository (or recorded as already done in the original checklist where the repo supports it).
- `[ ]` Still needed, incomplete, or not verifiable from the repository.
- **Optional / conditional** means it is not required for the core release unless the team or instructor says otherwise.

## Current snapshot

The current branch is `feature/login-register`. Login/Register and the admin dashboard/management pages are implemented against the mock API; the development auth bypass is disabled. Cart/checkout, reservations, profile, and order history/tracking are still mostly placeholders. Admin route checks are client-side only because json-server does not enforce roles. The real backend is not implemented. Tests and deployment have not been verified. `.gitignore` had a pre-existing change and was left untouched. `To-Do.md` was already untracked and has been updated in place.

## Phase 0: Decisions

- [ ] Verify official DEPI deliverables, submission format, and grading criteria with the instructor; no evidence of this confirmation is in the repo.
- [ ] Confirm final brand details (name, logo, address, phone, email, schedule) with the team. Velora values exist, but `brand.js` says several are unconfirmed.
- [x] Use the Velora visual direction; Nocturne is archived and no longer current.
- [ ] Confirm the actual member assignments with the team. Repo ownership guidance is in `CLAUDE.md`; the original checklist's alternate split is stale.
- [x] Git workflow is documented in `CONTRIBUTING.md` (feature branches and pull requests); team practice still needs to be followed.
- [ ] Decide with Ahmed Emad whether to ship on json-server or finish the proposed FastAPI backend. Do not treat the original checklist's “decision made” as verified.

## Phase 1: Project setup

- [x] React/Vite app and project structure exist.
- [x] React Router routes are registered in `client/src/App.jsx`.
- [x] json-server script and mock database exist (`client/package.json`, `server/mock/db.json`).
- [x] Data schema and seed data exist; the menu is larger than the original 15–20 dish target.
- [x] Root and client README files contain setup instructions.

## Phase 2: Design system and layout

- [x] Velora theme, fonts, and styles are present.
- [x] Navbar, Footer, Layout, Loader, ErrorMessage, DishCard, and Logo exist.
- [x] Routes exist, with placeholders for unfinished pages.
- [x] FormInput is implemented and used by Login and Register.
- [ ] QuantitySelector remains a placeholder; its behavior is still inline on the dish page.
- [x] StatusBadge and ConfirmModal are implemented for the admin pages.

## Phase 3: Paperwork and design

- [x] `orderItems`/`order_items` preserve the dish name at order time in the data contract and schema.
- [x] ERD and database-schema documents exist and describe the schema.
- [ ] Wireframes are not present in `docs/design/wireframes/`; the README table is unticked. Confirm with the instructor whether all are required or whether screenshots of implemented pages are acceptable.
- [ ] Minimum design documents are incomplete: problem statement is TODO, use case descriptions are TODO, and software architecture is TODO.
- [ ] Confirm whether overdue planning/design deliverables can still be submitted; repo cannot verify an instructor response.

## Phase 4: Menu and dish pages

- [x] Menu page: category selection, search, price filtering, vegetarian filtering, URL category parameter, loading/error/empty states are implemented inline in `client/src/pages/Menu.jsx`.
- [x] Dish details: sizes, extras, live unit price, add to cart, unavailable state, and not-found state are implemented in `client/src/pages/DishDetails.jsx`.
- [x] About and NotFound pages are implemented.
- **Optional:** Separate `CategoryTabs`, `SearchBar`, `FilterBar`, `SizeSelector`, `ExtrasSelector`, and `QuantitySelector` components are placeholders, but the corresponding browsing/customization behavior is inline in the pages. Extract them only if useful or required by the team.
- [ ] Verify dish photos against the menu data and add missing photos if needed. The image folder has site photos; dish image coverage was not checked record by record.
- [ ] Confirm the address, phone, email, and opening hours in `client/src/config/brand.js` with the team.

## Phase 5: Login and registration

- [x] Build Login and Register forms and connect them to the existing mock API and AuthContext.
- [x] Add field validation, login errors, return redirect, duplicate-email check, and customer-only registration.
- [x] Disable `BYPASS_AUTH` so protected routes are guarded in development too.
- [ ] Run and verify login, registration, return redirect, and protected routes while logged out and as customer/admin.
- [ ] Build Profile page (currently a placeholder).

## Phase 6: Cart and checkout

- [x] `CartContext` supports add, quantity update, remove, clear, computed totals, and localStorage persistence; distinct size/extras make distinct cart lines.
- [ ] Build `CartItem`, `OrderSummary`, Cart page, and Checkout page; components/pages are placeholders.
- [ ] Implement checkout validation, pickup-time rules, cash/demo-card validation, decline behavior, and safe handling if saving an order fails partway.
- [ ] On success, clear the cart and navigate to the new order with a confirmation.

## Phase 7: Order history and tracking

- [ ] Build `StatusBadge`, `OrderCard`, `StatusStepper`, Orders, and OrderTracking; they are placeholders.
- [ ] Enforce owner-only order access in the UI and refresh tracking data every 30 seconds.
- [ ] Add cancellation only while status is `received`.

## Phase 8: Table reservations

- [ ] Build Reservation page (currently a placeholder).
- [ ] Validate past date, opening hours, party size, phone format, and duplicate pending reservation.
- [ ] Create pending reservations and show confirmation; add reservation listing/cancellation to Profile.

## Phase 9: Admin pages

- [ ] Build `DishForm` and `ConfirmModal`.
- [ ] Build ManageMenu, including search, add/edit, availability toggle, and safe delete flow.
- [ ] Build ManageOrders with filters, item details, valid next status, and cancellation rules.
- [ ] Build ManageReservations with filters and status actions.
- [x] Build Dashboard summary and links, ManageMenu, ManageOrders, and ManageReservations using existing admin routes and API helpers.
- [x] Add/edit dish form, availability toggle, order status actions, reservation status actions, search/filtering, and confirmation dialogs.
- [ ] Verify admin access and CRUD/status flows in the running app; no test run has been done for this work.

## Phase 10: Real backend (conditional on team decision)

The FastAPI/SQLite implementation is **not done**; files under `server/app/`, `server/seed.py`, and `server/tests/test_api.py` are scaffolds.

- [ ] Confirm the backend choice with Ahmed Emad.
- [ ] If FastAPI is chosen: implement configuration, database, models, seed, auth/security, routers, and tests in line with `docs/api.md` and `server/schema.sql`.
- [ ] If json-server is chosen for the release: document that it is demo-only and has no real authentication/security; do not start the real-backend track.
- **Optional:** Automated tests are optional per repository guidance.

## Phase 11: Arabic version (optional)

- **Optional / defer:** Arabic translation and RTL are explicitly optional. Prioritize the English core flows first.
- [ ] Only if the core release is complete and the team chooses to do it: add translations, language switch, RTL review, and Arabic font fallback.

## Phase 12: Testing and polish

- [ ] Run and record test cases T1–T12 in `docs/testing/test-plan.md`; the table is currently blank.
- [ ] Record and resolve discovered bugs in `docs/testing/bug-report.md`.
- [ ] Verify visitor, customer, and admin flows plus a ~375px viewport; no test evidence was produced in this review.
- [ ] Run lint, formatting check, and build before release; not run as part of this review.
- [ ] Remove placeholder pages/components only when no longer used. `PagePlaceholder.jsx` is still imported by unfinished pages/components, so it is currently needed.

## Phase 13: Deployment

- [ ] Choose and deploy the API (json-server also needs a persistent host if used live).
- [ ] Deploy the frontend to Netlify or Vercel.
- [ ] Set production `VITE_API_URL` and verify the live flows.
- [ ] Fill in `docs/deployment.md` and the live link in `README.md`.

## Phase 14: Final documents and presentation

- [ ] Finish `docs/user-manual.md` with instructions and screenshots from the live site.
- [ ] Finish `docs/technical-documentation.md` and complete/update `docs/api.md` to match the shipped implementation.
- [ ] Update roles with contribution evidence and fill KPI results.
- [ ] Review each deliverable with the instructor and update `docs/DELIVERABLES.md` statuses.
- [ ] Complete presentation sections and rehearse each member's part.
- [ ] Complete infographic; ask instructor for the DEPI track name first. Backup demo video is optional unless required.

## Phase 15: Final submission

- [ ] Merge approved work through the team's PR workflow; do not commit directly to `main`.
- [ ] Clone/check out a fresh copy and verify the documented setup works.
- [ ] Submit required deliverables before the deadline.

## Definition of done

- [ ] Customer can register, browse/customize dishes, place pickup order, track it, and reserve a table.
- [ ] Admin can manage menu, orders, and reservations.
- [ ] English works across all shipped pages; Arabic is optional.
- [ ] Site is deployed and the live link works.
- [ ] README and required documentation are complete.
- [ ] Presentation/demo are prepared and rehearsed.
- [ ] Required deliverables have been submitted.

## Repository files to use as the source of truth

- Instructions and ownership: `CLAUDE.md`, `AGENTS.md`
- Pages and components: `docs/pages.md`, `client/src/`
- API contract: `docs/api.md`
- Schema and ERD: `server/schema.sql`, `docs/design/erd.md`
- Deliverables: `docs/DELIVERABLES.md`
