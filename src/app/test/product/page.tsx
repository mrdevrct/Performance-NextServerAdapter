"use client";
import React, { useEffect, useState } from "react";

// تعریف تایپ برای نتیجه تست
interface TestResult {
  label: string;
  status: number;
  time: string;
  cacheHeader: string;
}

// ✅ تابع تست سرعت
async function testFetch(
  label: string,
  url: string,
  options: RequestInit = {}
): Promise<TestResult> {
  const start = performance.now();
  const res = await fetch(url, options);
  const end = performance.now();

  const time = (end - start).toFixed(2);
  const cacheHeader =
    res.headers.get("x-cache") ||
    res.headers.get("cf-cache-status") ||
    res.headers.get("x-cache-info") ||
    "N/A";

  return {
    label,
    status: res.status,
    time,
    cacheHeader,
  };
}

export default function ProductPerformanceDemo() {
  const [results, setResults] = useState<TestResult[]>([]);
  const slug = "romance-lubricant-gel-emotion-with-apple-scent-volume-75ml";

  async function runTest() {
    const testResults: TestResult[] = [];

    // 1️⃣ Server Adapter (Edge API)
    const serverAdapter = await testFetch(
      "Server Adapter (Edge)",
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${slug}`,
      { cache: "force-cache" }
    );

    // 2️⃣ Direct Fetch (WordPress)
    const direct = await testFetch(
      "Direct Fetch (WordPress)",
      `${process.env.NEXT_PUBLIC_API_URL}/productapi.php?slug=${slug}`,
      { cache: "no-store" }
    );

    // 2️⃣ Direct Fetch directCash (WordPress)
    const directCash = await testFetch(
      "Direct Fetch (WordPress)",
      `${process.env.NEXT_PUBLIC_API_URL}/productapi.php?slug=${slug}`,
      { cache: "force-cache" }
    );

    // 3️⃣ Client Fetch (Browser → Next.js)
    const client = await testFetch(
      "Client Fetch (Browser → API)",
      `/api/products/${slug}`,
      { cache: "no-store" }
    );

    testResults.push(serverAdapter, direct, directCash, client);
    setResults(testResults);

    console.table(testResults);
  }

  useEffect(() => {
    runTest();
  }, []);

  const getColor = (label: string): string => {
    if (label.includes("Server")) return "#22c55e";
    if (label.includes("Direct")) return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        🚀 Product Performance Benchmark
      </h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        <b>Slug:</b> {slug}
        <br />
        مقایسه بین <b>Server Adapter</b>، <b>Direct Fetch</b> و{" "}
        <b>Client Fetch</b>
      </p>

      <button
        onClick={runTest}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        🔄 اجرای دوباره تست
      </button>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 15,
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #e2e8f0",
                backgroundColor: "#f1f5f9",
              }}
            >
              <th align="left" style={{ padding: "10px 8px" }}>
                Type
              </th>
              <th align="left" style={{ padding: "10px 8px" }}>
                Status
              </th>
              <th align="left" style={{ padding: "10px 8px" }}>
                Response Time (ms)
              </th>
              <th align="left" style={{ padding: "10px 8px" }}>
                Cache
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: i % 2 ? "#f9fafb" : "white",
                }}
              >
                <td style={{ padding: "8px 8px", fontWeight: 600 }}>
                  {r.label}
                </td>
                <td style={{ padding: "8px 8px" }}>{r.status}</td>
                <td style={{ padding: "8px 8px", color: getColor(r.label) }}>
                  {r.time}
                </td>
                <td style={{ padding: "8px 8px" }}>{r.cacheHeader}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {results.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 8, fontSize: 18 }}>
              📊 نمودار مقایسه زمان پاسخ
            </h3>
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-end",
                height: 200,
              }}
            >
              {results.map((r, i) => (
                <div
                  key={i}
                  title={`${r.label}: ${r.time} ms`}
                  style={{
                    height: `${Math.min(parseFloat(r.time), 200)}px`,
                    width: "60px",
                    backgroundColor: getColor(r.label),
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: 8,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    transition: "height 0.4s ease",
                  }}
                >
                  <span style={{ fontSize: 12, marginBottom: 4 }}>
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p style={{ marginTop: 24, color: "#888" }}>
        نتایج دقیق‌تر در <b>Console</b> مرورگر هم چاپ می‌شود.
      </p>
    </div>
  );
}
