# How we work on GitHub

1. Never commit directly to `main`.
2. Start every task from the latest `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b feature/<short-name>      # e.g. feature/cart
   ```
3. Commit small and often, with clear messages:
   ```bash
   git add .
   git commit -m "Add quantity controls to cart"
   git push -u origin feature/<short-name>
   ```
4. Open a Pull Request on GitHub (use the template), and ask a teammate to review it.
5. After the review, merge it into `main`, then delete the branch.
6. A feature is "done" only when it works on mobile and is merged.

## Branch names
`feature/menu`, `feature/cart`, `feature/auth`, `feature/reservation`, `feature/admin`, `feature/backend`, `docs/<topic>`, `fix/<bug>`

## Commit message examples
- `Add DishCard component`
- `Fix cart total when size changes`
- `Add reservation validation rules`

## Before you open a Pull Request
- Run `npm run format`, `npm run lint` and `npm run build` in `client/` (all must pass).
- New CSS goes only in `client/src/styles/app.css` with new class names. Do not edit Velora's CSS files.
- Never type the restaurant name or contact details inside a page: use `BRAND` from `src/config/brand.js`.

## Weekly meeting (20 min)
What is done, what is blocked, what is next.
