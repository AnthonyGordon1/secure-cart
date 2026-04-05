### Vulnerability — Broken Access Control / IDOR (Insecure Direct Object Reference)

**Category:** Broken Access Control

**CVSS Score:** 8.1 (High)

**OWASP:** A01:2021 - Broken Access Control

**Affected file:** `backend/src/routes/orders.js`

---

**What it is**

IDOR stands for Insecure Direct Object Reference. It happens when an application exposes internal object identifiers — like a database row ID — directly in the URL without checking whether the requesting user actually has permission to access that object. In SecureCart the GET /api/orders/order/:id endpoint accepted any integer ID and returned the order without verifying the requesting user owned it. Since order IDs are sequential integers starting at 1, an attacker with a valid login can enumerate every order in the system by just counting up.

**Why it existed in SecureCart**

The endpoint fetched the order from the database and returned it immediately with no ownership check. There was nothing comparing the order's user_id to the authenticated user's ID from the JWT token.

**How to reproduce**

```bash
python3 docs/exploits/idor-order-enum.py
```

Expected output on vulnerable version:

```
    Found order #1 — user_id: 2, total: $99.99
    Found order #2 — user_id: 2, total: $199.98
    Found order #3 — user_id: 2, total: $299.97
    Found order #4 — user_id: 2, total: $399.96
    Found order #5 — user_id: 2, total: $499.95
    Found order #6 — user_id: 2, total: $599.94
    Found order #7 — user_id: 2, total: $699.93
    Found order #8 — user_id: 2, total: $799.92
    Found order #9 — user_id: 2, total: $899.91
    Found order #10 — user_id: 2, total: $999.90
[!] EXPLOIT SUCCESSFUL — accessed orders without ownership check
```

**The fix**

After fetching the order, compare the order's user_id to the authenticated user's ID. If they do not match return 403.

```jsx
// Vulnerable
router.get('/order/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(order);
});

// Patched
router.get('/order/:id', verifyToken, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (order.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(order);
});
```

**Verification**

After applying the patch, the exploit script outputs `Exploit failed — could not access any orders belonging to other users`. Admin's order returns 403 to the attacker.

---

**How this plays out in a real workplace**

IDOR is one of the most commonly found vulnerabilities in bug bounty programs and real-world pen tests. The reason it shows up so often is that developers think about authentication — making sure a user is logged in — but forget about authorization — making sure a logged in user can only access what belongs to them. These are two different things and mixing them up is an extremely common mistake.

In a real workplace this finding would come from a manual test or an automated scan of API endpoints. The AppSec engineer logs in as a regular user, grabs their order ID from a legitimate request, then manually increments it by 1 and checks if they get back someone else's order. If they do, that is the PoC. Write the issue, tag the dev, fix is one if-statement, verify and close. Realistically this is a 30-minute fix but the business impact is significant — any customer's purchase history is exposed to any other customer.

**Real world example**

In 2021 Experian, one of the three major credit bureaus, had an IDOR vulnerability in their credit check API. A security researcher discovered that by simply changing a numeric ID in an API request you could pull another person's credit score and financial history with no authentication beyond a basic API key. The vulnerability was reported and Experian initially dismissed it. The researcher went public and Experian was forced to address it. The scary part — this was not some startup with a small security team. This was a company whose entire business is handling sensitive financial data for hundreds of millions of Americans. One missing ownership check. Same exact pattern as what we built and exploited in SecureCart.

Another example closer to fintech — in 2019 Venmo's public API exposed every transaction in their feed by default with sequential IDs. A researcher wrote a script that iterated through transaction IDs and pulled purchase history for millions of users including what they bought, who they paid, and personal notes attached to payments. No hack required. Just a for loop and an API call. Venmo eventually added privacy controls but the data had already been scraped and published.

This is why ownership checks are not optional. Logging in is step one. Checking whether the logged-in user is allowed to see that specific piece of data is step two. Most breaches that make the news skip step two.

Authentication and authorization are not the same thing. `verifyToken` confirms who you are. The ownership check confirms what you are allowed to see. You need both. One without the other is not access control — it is just a locked front door with all the windows open.

---

**Errors encountered while building this**

| Error | Cause | Fix |
| --- | --- | --- |
| 401 Invalid credentials on exploit login | Attacker account did not exist after database.sqlite was deleted and recreated | Added register step to exploit before login, with 409 handling for existing accounts |
| Exploit showed SUCCESSFUL even after patch was applied | All seeded orders belonged to the attacker's own user_id so ownership check was never triggered | Created an order as admin first in Thunder Client, giving the attacker a cross-user order to attempt |
| Exploit still showed SUCCESSFUL after cross-user order was created | Reporting logic only checked if any orders were found, not whether cross-user orders were blocked | Added cross_user_orders filter to only flag orders where user_id does not match the attacker's ID |
| ConnectionRefusedError on port 3000 | Backend was not running when exploit was executed | Start backend with npm run dev before running any exploit scripts |
| IndentationError on run_exploit function | Steps 2-5 were written outside the function body instead of inside it | Moved all steps inside run_exploit with consistent 4-space indentation |
| KeyError: register_endpoint | TARGET config was missing register_endpoint and attacker_username keys | Added both keys to the TARGET dictionary |