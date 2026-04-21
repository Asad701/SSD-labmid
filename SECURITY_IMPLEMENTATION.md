# Security Implementation Report

**Project:** SecureApp-Sprint-VulnSight  
**Phase:** Remediation & Mitigation Verification  
**Status:** PARTIALLY HARDENED (CSRF/Clickjacking Fixed, IDOR Active for Lab)

---

## 1. IDOR (Insecure Direct Object Reference)
**Affected Endpoint:** `DELETE /api/users`  
**Status:** **[VULNERABLE]** (Maintained for educational demonstration)

### Description
The application intentionally maintains an IDOR vulnerability on the user management endpoint to support laboratory exercises in access control bypass.

---

## 2. CSRF (Cross-Site Request Forgery)
**Affected Endpoint:** `POST /api/deleteAccount`  
**Status:** **[REMEDIATED]**

### Remediation
Implemented **Custom Header Verification** (`X-Requested-With`). This defense relies on the fact that cross-origin HTML `<form>` submissions cannot attach custom headers without triggering a CORS preflight, which is not authorized for the attacker's origin.

### Evidence of Fix
- [x] Attacker Site (`port 3001`) form submissions return `403 Forbidden`.
- [x] Legitimate internal requests (which include the header) are processed successfully.

---

## 3. Clickjacking (UI Redressing)
**Affected Scope:** Global  
**Status:** **[REMEDIATED]**

### Remediation
Implemented a global security header policy within the Next.js `next.config.mjs` configuration.

**Final Implementation:**
```javascript
{ key: 'X-Frame-Options', value: 'DENY' }
```

### Evidence of Fix
- [x] Attacker Site (`port 3001`) iframe injection is blocked by the browser.
- [x] Console error: `Refused to display 'http://localhost:3000/' in a frame because it set 'X-Frame-Options' to 'deny'`.

---

## 4. Final Summary
As requested, CSRF and Clickjacking have been remediated on the main application origin. The IDOR vulnerability has been preserved as the primary internal laboratory exercise.
