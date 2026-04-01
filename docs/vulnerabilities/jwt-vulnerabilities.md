### Vulnerability 1 JWT alg:none Bypass

**Category:** Broken Authentication

**CVSS Score:** 9.1 (Critical)

**OWASP:** A07:2021 - Identification and Authentication Failures

**Affected file:** `backend/src/routes/auth.js`

---

**What it is**

JSON Web Tokens have three parts: a header, a payload, and a signature. The header tells the server which algorithm was used to sign the token. When a server trusts whatever algorithm the token claims to use, an attacker can set the algorithm to `none`, strip the signature entirely, and the server accepts the token as valid. This means any attacker with a basic understanding of JWT structure can forge a token claiming any role they want, including admin with no knowledge of the secret key.

**Why it existed in SecureCart**

`jwt.verify()` was called without enforcing a specific algorithm. The jsonwebtoken library defaults to trusting the `alg` claim in the token header, which means a token with `"alg": "none"` and no signature passes verification.

**How to reproduce**

```bash
python3 docs/exploits/jwt-alg-none.py
```

Expected output on vulnerable version:

```
[!] EXPLOIT SUCCESSFUL — admin panel accessed with forged token
Status: 200
Response: [{"id":1,"username":"admin","email":"admin@securecart.com"...}]
```

**The fix**

Pass `{ algorithms: ['HS256'] }` as the third argument to `jwt.verify()`. This explicitly tells the library to reject any token that was not signed with HS256, including tokens with `alg:none`.

```jsx
// Vulnerable
jwt.verify(token, secret, callback);

// Patched
jwt.verify(token, secret, { algorithms: ['HS256'] }, callback);
```

**Verification**

After applying the patch, running `jwt-alg-none.py` returns `403 Invalid or rejected token`. The exploit fails.


---

### Vulnerability 2 — JWT Weak Secret (Brute Force)

**Category:** Broken Authentication / Cryptographic Failure

**CVSS Score:** 8.8 (High)

**OWASP:** A02:2021 - Cryptographic Failures

**Affected file:** `.env`

---

**What it is**

JWT tokens are signed with a secret key using HMAC-SHA256. If that secret is a common word found in a password wordlist, an attacker who has obtained a valid token can brute force the secret by computing signatures with candidate words until one matches. Once the secret is known, the attacker can forge any token they want with a valid signature including one claiming admin privileges.

**Why it existed in SecureCart**

`JWT_SECRET` was set to `changeme` a value present in virtually every common wordlist including rockyou.txt. A 15-word demo wordlist cracked it in under one second.

**How to reproduce**

```bash
python3 docs/exploits/jwt-brute-force.py
```

Expected output on vulnerable version:

```
[!] SECRET FOUND: 'changeme'
[!] EXPLOIT SUCCESSFUL — admin panel accessed with forged token
```

**The fix**

Rotate `JWT_SECRET` to a cryptographically random 256-bit value. Never use dictionary words, common phrases, or placeholder values as JWT secrets.

```
# Vulnerable
JWT_SECRET=changeme

# Patched
JWT_SECRET=a1f3c9e7b2d4f6a8c0e2d4f6b8a0c2e4f6d8b0a2c4e6f8d0b2a4c6e8f0d2b4a6
```

**Verification**

After rotating the secret, running `jwt-brute-force.py` outputs `Secret not found in wordlist`. The exploit fails because the new secret is not in any common wordlist.

---

**How this plays out in a real workplace**

So real talk this exact type of  vuln is what took down Auth0 back in 2015. A security researcher named Tim McLean discovered that the jsonwebtoken library accepted alg:none tokens by default, meaning anyone who understood how JWTs worked could forge tokens for any user on any platform using Auth0 at the time. No credentials needed. Just a text editor and some base64 knowledge. That is not a niche edge case that is millions of applications at risk from one missing parameter.

In a real workplace this would come up during a code review or a PR where the AppSec engineer spots jwt.verify() with no algorithm enforcement. They write a PoC, same thing I just built, confirm it works in staging, and open a GitHub issue tagged Critical with a 48-hour SLA. The developer who owns auth gets tagged directly.
And here is the thing that conversation goes way smoother when you can just run a script and show the output. No developer is going to push back on "this is a theoretical risk" when you can literally show them [!] EXPLOIT SUCCESSFUL — admin panel accessed with forged token on their own codebase. The PoC is the argument.
After the fix ships the AppSec engineer reruns both scripts against the patched version, confirms they fail, and closes the ticket. Any tokens signed with the old weak secret get invalidated automatically once the secret rotates worth a quick Slack heads up before deploying so users are not confused about why they got logged out.

**Lessons learned**

Never trust the algorithm claim in a JWT header always enforce it server side. Your JWT secret should be treated like a private key, not a password. If it fits in your memory, it is too weak.

But honestly the bigger lesson for me was around proof of concepts. I was both the developer and the AppSec engineer here which made the whole thing click differently. I spent a lot of time building the auth feature the register flow, the login, the token generation and then I turned around and hacked it in about 20 lines of Python. That experience changes how you think about code you write. Every time I add a new route now my first instinct is "how would I exploit this." That shift in mindset is the whole point of this project.

---