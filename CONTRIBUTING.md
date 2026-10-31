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

## Weekly meeting (20 min)
What is done, what is blocked, what is next.
