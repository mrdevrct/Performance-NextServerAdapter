"use client";
import React, { useEffect, useState } from "react";
import { Shield, Zap, Globe, Cloud } from "lucide-react"; // lucide-react icons (built-in in Next projects)

// ✅ تابع تست API
async function testFetch(label, url, options = {}) {
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

export default function CategoriesBenchmarkDemo() {
  const [results, setResults] = useState([]);

  async function runTest() {
    const testResults = [];

    // 1️⃣ Server Adapter (Edge)
    const serverAdapter = await testFetch(
      "Server Adapter (Edge)",
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`,
      { cache: "force-cache" }
    );

    // 2️⃣ Direct Fetch (WordPress)
    const direct = await testFetch(
      "Direct Fetch (WordPress)",
      `${process.env.NEXT_PUBLIC_API_URL}/productcatapi.php`,
      { cache: "no-store" }
    );

    // 3️⃣ Direct Fetch (WordPress Cached)
    const directCache = await testFetch(
      "Direct Fetch (WordPress Cached)",
      `${process.env.NEXT_PUBLIC_API_URL}/productcatapi.php`,
      { cache: "force-cache" }
    );

    // 4️⃣ Client Fetch (Browser → Next.js)
    const client = await testFetch(
      "Client Fetch (Browser → API)",
      `/api/categories`,
      { cache: "no-store" }
    );

    testResults.push(serverAdapter, direct, directCache, client);
    setResults(testResults);

    console.table(testResults);
  }

  useEffect(() => {
    runTest();
  }, []);

  const getColor = (label) => {
    if (label.includes("Server")) return "#22c55e";
    if (label.includes("Cached")) return "#84cc16";
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
        🚀 Categories Benchmark + Explanation
      </h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        مقایسه بین{" "}
        <b>Server Adapter (Edge)</b>، <b>Direct Fetch</b> و{" "}
        <b>Client Fetch</b> همراه با توضیحات عملکرد.
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

      {/* جدول نتایج */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: 40,
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

        {/* نمودار */}
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
                    height: `${Math.min(r.time, 200)}px`,
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

      {/* کارت‌های توضیحی */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        📘 توضیح عملکرد روش‌ها
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {/* Server Adapter */}
        <div
          style={{
            backgroundColor: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <Shield color="#16a34a" size={30} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>
            Server Adapter (Edge)
          </h3>
          <p style={{ fontSize: 14, color: "#065f46" }}>
            مرورگر → Next.js Edge → WordPress  
            بدون CORS و با کش CDN در سراسر دنیا.
          </p>
          <ul style={{ fontSize: 13, marginTop: 8, color: "#065f46" }}>
            <li>✅ سریع در حالت Warm Cache</li>
            <li>✅ امنیت بالا و بدون کوکی سمت کاربر</li>
            <li>⚠️ Cold Start در بار اول</li>
          </ul>
        </div>

        {/* Direct Fetch */}
        <div
          style={{
            backgroundColor: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <Globe color="#b45309" size={30} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>
            Direct Fetch (WordPress)
          </h3>
          <p style={{ fontSize: 14, color: "#78350f" }}>
            مرورگر مستقیماً به سرور وردپرس وصل می‌شود  
            با CORS و handshake های شبکه.
          </p>
          <ul style={{ fontSize: 13, marginTop: 8, color: "#78350f" }}>
            <li>✅ داده همواره تازه</li>
            <li>⚠️ کندتر به خاطر TLS و CORS</li>
            <li>❌ ناامن برای API خصوصی</li>
          </ul>
        </div>

        {/* Client Fetch */}
        <div
          style={{
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <Cloud color="#1d4ed8" size={30} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>
            Client Fetch (Browser → API)
          </h3>
          <p style={{ fontSize: 14, color: "#1e3a8a" }}>
            مرورگر از API داخلی نکست استفاده می‌کند  
            که خودش از وردپرس داده می‌گیرد.
          </p>
          <ul style={{ fontSize: 13, marginTop: 8, color: "#1e3a8a" }}>
            <li>✅ کنترل کامل در سمت نکست</li>
            <li>⚠️ دو مرحله (Browser→Next→WP)</li>
            <li>⚖️ مناسب برای صفحات تعاملی</li>
          </ul>
        </div>
      </div>

      <p style={{ marginTop: 24, color: "#888" }}>
        نتایج دقیق‌تر در Console مرورگر قابل مشاهده است.
      </p>
    </div>
  );
}
