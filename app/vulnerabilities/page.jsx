"use client";

import React from 'react';
import Link from 'next/link';

const VulnerabilityCard = ({ title, category, description, link, type }) => (
  <div style={{ 
    backgroundColor: '#fff', 
    border: '1px solid #ddd', 
    borderRadius: '12px', 
    padding: '24px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <div>
      <div style={{ 
        display: 'inline-block', 
        padding: '4px 12px', 
        borderRadius: '20px', 
        backgroundColor: '#f1f3f5', 
        fontSize: '12px', 
        fontWeight: 'bold', 
        color: '#495057',
        marginBottom: '12px'
      }}>
        {category}
      </div>
      <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#212529' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
        {description}
      </p>
    </div>
    <Link 
      href={link} 
      style={{
        display: 'block',
        textAlign: 'center',
        padding: '10px',
        backgroundColor: type === 'primary' ? '#007bff' : '#6c757d',
        color: 'white',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'opacity 0.2s'
      }}
      onMouseOver={(e) => e.target.style.opacity = '0.9'}
      onMouseOut={(e) => e.target.style.opacity = '1'}
    >
      Launch Demo →
    </Link>
  </div>
);

export default function VulnerabilitiesDashboard() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', color: '#212529', marginBottom: '10px' }}>Security Lab Dashboard</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Interactive Proof of Concepts for OWASP Top 10 Mitigations
        </p>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px' 
      }}>
        <VulnerabilityCard 
          title="Insecure Direct Object Reference" 
          category="A01:2021 – Broken Access Control" 
          description="Test if the application allows deleting other users' accounts by simply manipulating the User ID parameter in the request body."
          link="/idor-demo"
          type="primary"
        />

        <VulnerabilityCard 
          title="Cross-Site Request Forgery" 
          category="A01:2021 – Broken Access Control" 
          description="Demonstrate how a malicious third-party site can trick a user's browser into performing sensitive actions without their knowledge."
          link="/csrf-demo"
          type="primary"
        />

        <VulnerabilityCard 
          title="Clickjacking (UI Redressing)" 
          category="A05:2021 – Security Misconfiguration" 
          description="Verify if the application can be embedded in an iframe and overlaid with deceptive elements to trick users into unintended clicks."
          link="/clickjack-demo.html"
          type="primary"
        />
      </section>

      <div style={{ 
        marginTop: '60px', 
        padding: '30px', 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        border: '1px solid #dee2e6' 
      }}>
        <h2 style={{ marginTop: 0 }}>Vulnerability Report</h2>
        <p>
          For a full technical breakdown of these vulnerabilities, root causes, and remediation steps, please refer to the project's security documentation.
        </p>
        <Link 
          href="/VULNERABILITY_DETAILS.md" 
          style={{ color: '#007bff', fontWeight: 'bold' }}
        >
          View Technical Report →
        </Link>
      </div>

      <footer style={{ marginTop: '60px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
        <p>Royal Fold & Forge Security Sprint 2026</p>
      </footer>
    </div>
  );
}
