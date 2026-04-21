# Threat Model & Risk Assessment

**Project:** SecureApp-Sprint-VulnSight  
**Sprint Phase:** 2 (Hours 4–12)

---

## 1. STRIDE Threat Analysis

| Threat Category | Applied Threat Description | Vulnerable Endpoint | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **S**poofing | Attacker triggers actions on behalf of a victim. | `/api/deleteAccount` | Anti-CSRF Tokens |
| **T**ampering | User modifies data belonging to another user. | `/api/users (DELETE)` | Object-level Authorization |
| **R**epudiation | Lack of logs for account deletion. | `/api/deleteAccount` | Auditable Audit Logging |
| **I**nformation Disclosure | Accessing user data without permission. | `/api/account (GET)` | Session Validation |
| **D**enial of Service | Mass-deleting users via automated IDOR script. | `/api/users (DELETE)` | Rate Limiting + Auth |
| **E**levation of Privilege | Normal user performing admin deletion. | `/api/users (DELETE)` | RBAC (Role-Based Access) |

## 2. Risk Assessment (CVSS v3.1)

| Vulnerability | Attack Vector | Base Score | Severity | Description |
| :--- | :--- | :--- | :--- | :--- |
| **IDOR** | Network | **8.1** | **High** | Attacker can delete users' accounts knowing only their UID. High impact on Integrity. |
| **CSRF** | Network | **6.5** | **Medium** | Trick authenticated users into deleting their account. Significant impact on Availability. |
| **Clickjacking** | Network | **4.3** | **Medium** | Trick users into unintended UI interactions. Low impact on Confidentiality/Integrity. |

### CVSS Calculation Detail (IDOR)
*   **Vector String:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:H/A:H`
*   **Attack Vector:** Network
*   **Attack Complexity:** Low
*   **Privileges Required:** Low (Registered User)
*   **User Interaction:** None
*   **Impact:** High (Availability & Integrity)

## 3. Attack Tree (Account Takeover / Deletion)

```text
Root: Unauthorized Data Destruction
 ├── Goal 1: Delete User Account
 │    ├── Path A: Exploit IDOR [Vulnerable Code in /api/users]
 │    │    └── Step: Scripted deletion of UIDs sequentially.
 │    └── Path B: Exploit CSRF [Vulnerable Code in /api/deleteAccount]
 │         └── Step: Victim clicks malicious link to auto-submit form.
 └── Goal 2: Hijack UI [Clickjacking]
      └── Step: Overlay fake buttons in iframe over victim's site.
```

## 4. Summary
The threat model identifies **IDOR** as the most critical risk due to its high impact and ease of automation. Immediate prioritization must be given to implementing server-side ownership checks on all object-level accesses.
