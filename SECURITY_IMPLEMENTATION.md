# Security Implementation Report

**Project:** SecureApp-Sprint-VulnSight  
**Phase:** Remediation & Mitigation Verification  
**Status:** VULNERABLE (Intentionally prepared for Lab Demonstration)

---

## 1. IDOR (Insecure Direct Object Reference)
**Affected Endpoint:** `DELETE /api/users`  
**Mitigation Category:** Broken Access Control Fix

### Remediation
Implemented strict identity verification. The application now compares the `userid` extracted from the cryptographically signed JWT with the `uid` provided in the request body. Administrative accounts are exempt from this ownership check but are explicitly verified for the `admin` role.

### Evidence of Fix
- [x] Unauthorized deletion attempts return `403 Forbidden`.
- [x] Valid ownership deletions are processed correctly.
- [x] Administrative deletions are restricted to authorized users.

---

## 2. CSRF (Cross-Site Request Forgery)
**Affected Endpoint:** `POST /api/deleteAccount`  
**Mitigation Category:** Session Security Enhancement

### Remediation
Applied a defense-in-depth approach:
1.  **SameSite Attribute:** Authentication cookies are now configured with `SameSite=Strict` to prevent automatic transmission on cross-site requests.
2.  **Explicit Verification:** Implemented checks for custom request headers (e.g., `X-Requested-With`) which cannot be set in simple cross-site HTML form submissions.

### Evidence of Fix
- [x] Cross-domain form submissions fail to attach authenticated cookies.
- [x] Direct API requests from foreign domains are blocked by the browser's CORS and SameSite policy.

---

## 3. Clickjacking (UI Redressing)
**Affected Scope:** Global  
**Mitigation Category:** Security Misconfiguration / Frame Protection

### Remediation
Implemented a global security header policy within the Next.js `next.config.mjs` configuration.

**Final Implementation:**
```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none';" }
        ],
      },
    ];
  },
};
```

### Evidence of Fix
A dedicated proof-of-concept page (`/clickjack-demo.html`) was used to verify the fix.
- **Before Fix:** The application was successfully framed, allowing UI overlay attacks.
- **After Fix:** The browser refused to render the application in a frame, throwing a console error:
  `Refused to display 'http://localhost:3001/' in a frame because it set 'X-Frame-Options' to 'deny'`.

---

## 4. Final Summary
TFollowing this security sprint, the **Royalfold** platform has been intentionally left in a **Vulnerable (Lab Ready)** state. All identified OWASP Top 10 vulnerabilities have been re-introduced and verified with technical PoCs to support educational demonstrations.
