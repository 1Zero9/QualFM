import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/policy", destination: "/privacy-policy", permanent: true },
      { source: "/terms-conditions", destination: "/terms", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/termsconditions", destination: "/terms", permanent: true },
      { source: "/services/:path+", destination: "/services", permanent: true },
      { source: "/sectors", destination: "/about", permanent: true },
      { source: "/sectors/:path+", destination: "/about", permanent: true },
      { source: "/access", destination: "/admin", permanent: true },
      { source: "/client-admin", destination: "/admin", permanent: true },
      { source: "/portal", destination: "/admin", permanent: true },
    ];
  },
};

export default nextConfig;
