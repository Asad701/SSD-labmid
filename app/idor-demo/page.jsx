"use client";

import React, { useState } from 'react';

export default function IDORDemo() {
  const [targetId, setTargetId] = useState('');
  const [status, setStatus] = useState('Idle');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerAttack = async () => {
    if (!targetId) {
      alert("Please enter a User ID to target!");
      return;
    }

    setLoading(true);
    setStatus('Attempting to delete user...');
    setResponse(null);

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: targetId }),
      });

      const data = await res.json();
      setResponse({ status: res.status, data });
      
      if (res.ok) {
        setStatus('Success! Account deleted (Demonstrated IDOR).');
      } else {
        setStatus(`Failed with status ${res.status}`);
      }
    } catch (err) {
      setStatus('Error connecting to the API.');
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #007bff', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#007bff', margin: 0 }}>IDOR Proof of Concept (Educational)</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>SSD Lab: Insecure Direct Object Reference</p>
      </header>

      <section style={{ backgroundColor: '#e7f1ff', border: '1px solid #b8daff', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h2 style={{ color: '#0056b3', marginTop: 0 }}>Description</h2>
        <p>
          This page demonstrates an <strong>Insecure Direct Object Reference (IDOR)</strong>. 
          The application allows any authenticated user to delete <em>any other</em> user's account 
          by simply providing their unique ID.
        </p>
        <p>
          <strong>Target Endpoint:</strong> <code>DELETE /api/users</code>
        </p>

        <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}>
          <h3>Vulnerability Analysis</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>The Flaw:</strong> The server-side code verifies that a user is logged in, but fails to check if the <code>userid</code> being deleted belongs to the person making the request.</li>
            <li><strong>The Fix:</strong> Implement ownership verification. Compare the <code>uid</code> in the request body with the <code>userid</code> stored in the cryptographically signed JWT session.</li>
          </ul>
        </div>
      </section>

      <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="target-id" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Target User ID:</label>
          <input 
            id="target-id"
            type="text" 
            value={targetId} 
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="e.g. USER_12345"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
        </div>
        <button 
          onClick={triggerAttack}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#dc3545',
            color: 'white',
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {loading ? 'Processing...' : '🔥 Trigger IDOR Attack'}
        </button>
      </div>

      <section style={{ backgroundColor: '#212529', color: '#f8f9fa', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ color: '#007bff', marginTop: 0, fontSize: '1.2rem' }}>Server Response</h2>
        <p style={{ color: '#adb5bd' }}>Status: <span style={{ color: '#ffc107' }}>{status}</span></p>
        <pre style={{ 
          backgroundColor: '#000', 
          color: '#00ff00', 
          padding: '15px', 
          borderRadius: '4px', 
          fontSize: '14px',
          overflowX: 'auto'
        }}>
          {response ? JSON.stringify(response, null, 2) : '// Response will appear here after triggering attack'}
        </pre>
      </section>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        <p>Secure Software Development - Vulnerability Demonstration</p>
      </footer>
    </div>
  );
}
