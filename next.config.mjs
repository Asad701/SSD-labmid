/** @type {import('next').NextConfig} */

// ==========================================
// SECURITY CONFIGURATION (TOGGLE VERSIONS)
// ==========================================

// --- VERSION 1: SECURE (Prevent Attack) ---
/*
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none';" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
*/

/**/
// --- VERSION 2: VULNERABLE (Do Attack) ---
const securityHeaders = [
  { key: 'Access-Control-Allow-Origin', value: '*' },
];




const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
