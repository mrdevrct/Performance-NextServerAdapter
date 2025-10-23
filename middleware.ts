/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  const allowedOrigins = ["https://your-frontend.com", "http://localhost:3000"];

  // Deny requests without origin or from unauthorized origins
  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse("Access Denied", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Deny requests with suspicious headers (e.g., CVE-2025-29927)
  if (request.headers.has("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rate limit (100 requests per minute per IP)
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const rateLimitWindow = 60 * 1000; // 1 minute
  const maxRequests = 100; // Maximum 100 requests

  const rateLimitStore =
    (globalThis as any).rateLimitStore || new Map<string, RateLimitRecord>();
  if (!(globalThis as any).rateLimitStore) {
    (globalThis as any).rateLimitStore = rateLimitStore;
  }

  let record = rateLimitStore.get(clientIP);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + rateLimitWindow,
    });
    record = rateLimitStore.get(clientIP);
  } else if (record.count >= maxRequests) {
    return new NextResponse("Too Many Requests", { status: 429 });
  } else {
    record.count++;
    rateLimitStore.set(clientIP, record);
  }

  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  // Set simple security header
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};