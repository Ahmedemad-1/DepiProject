# Test plan (manual)

| # | Scenario | Expected result | Result | Tester |
|---|---|---|---|---|
| T1 | Search for a dish by name | Only matching dishes appear | | |
| T2 | Filter by category and vegetarian | Only matching dishes appear | | |
| T3 | Add a dish with size and extras | Shows in the cart with the correct price | | |
| T4 | Refresh the page with a full cart | Cart stays the same | | |
| T5 | Open /checkout while logged out | Redirected to the login page | | |
| T6 | Pay with a card number ending in 0000 | Rejection message, no order created | | |
| T7 | Reserve with a past date or 12 people | Error message, reservation not sent | | |
| T8 | Admin changes an order status | Customer sees the new status | | |
| T9 | A normal user opens /admin | Blocked and redirected | | |
| T10 | Open the site on a phone | Layout fine, no horizontal scrolling | | |
