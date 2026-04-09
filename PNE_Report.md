# Protection Needs Elicitation (PNE) Report

**Project:** SecureApp-Sprint-VulnSight  
**Course:** CYC386 Secure Software Design and Development  
**Instructor:** Engr. Muhammad Ahmad Nawaz  
**Sprint Phase:** 1 (Hours 0–4)

---

## 1. Overview
This report documents the Protection Needs Elicitation (PNE) for the "Royal Fold & Forge" application. The goal is to identify critical assets and the necessary security requirements to protect against potential threats identified in the initial sprint phase.

## 2. Asset Identification

| Asset ID | Asset Name | Description | Sensitivity |
| :--- | :--- | :--- | :--- |
| A1 | User Credentials | Hashed passwords and session tokens stored in the database/cookies. | High |
| A2 | Personal User Data | Full names, email addresses, and shipping details (PNE Elicitation). | Moderate |
| A3 | Order History | Records of transactions and purchase data. | Low |
| A4 | Admin API Key | Environmental secret used to perform privilege-level actions. | Critical |
| A5 | Source Code | The application logic and API endpoints. | Moderate |

## 3. High-Level Threat Identification

| Threat ID | Threat Description | Target Assets |
| :--- | :--- | :--- |
| T1 | Unauthorized Account Deletion | A1, A2 (via IDOR/CSRF) |
| T2 | Data Exfiltration | A2, A3 (via SQLi / Broken Access Control) |
| T3 | Session Hijacking | A1 (via XSS / Weak Cookie Config) |
| T4 | Administrative Takeover | A4 (via exposed secrets) |

## 4. Protection Needs (Elicited Requirements)

Based on the assets and threats identified, the following protection needs are established:

1.  **Authorization (PN1)**: Every request to access or modify a resource (Object level) MUST verify that the requester has the permission to perform that action on that specific ID (Anti-IDOR).
2.  **Origin Validation (PN2)**: State-changing requests must be protected against cross-site exploitation via unique, randomized tokens (Anti-CSRF).
3.  **UI Integrity (PN3)**: The application must prevent itself from being redressed or embedded in frames on external domains to prevent click-fraud (Anti-Clickjacking).
4.  **Least Privilege (PN4)**: Admin-level API endpoints must strictly enforce role-based access control (RBAC).

## 5. Summary
The elicitation shows a critical need for **Broken Access Control** fixes. Without these protections, an attacker can manipulate user accounts (A1) and potentially exfiltrate personal data (A2) using simple IDOR or CSRF techniques.
