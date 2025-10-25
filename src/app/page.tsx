"use client";
import React, { useEffect, useState } from "react";

// Define type for test result
interface TestResult {
  label: string;
  status: number;
  time: string;
  cacheHeader: string;
}

// Speed test function
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

// Reusable component for rendering table and chart
const ResultDisplay: React.FC<{
  results: TestResult[];
  title: string;
  slug?: string;
}> = ({ results, title, slug }) => {
  const getColor = (label: string): string => {
    if (label.includes("Server")) return "#22c55e";
    if (label.includes("Direct")) return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: 24,
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        {title}
      </h2>
      {slug && (
        <p style={{ color: "#555", marginBottom: 16 }}>
          <b>Slug:</b> {slug}
        </p>
      )}
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
              <td style={{ padding: "8px 8px", fontWeight: 600 }}>{r.label}</td>
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
            📊 Response Time Comparison Chart
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
                <span style={{ fontSize: 12, marginBottom: 4 }}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function PerformanceDemo() {
  const [productResults, setProductResults] = useState<TestResult[]>([]);
  const [categoryResults, setCategoryResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  );

  const slug = "romance-lubricant-gel-emotion-with-apple-scent-volume-75ml";

  async function runProductTest() {
    const testResults: TestResult[] = [];

    // Server Adapter (nodejs API)
    const serverAdapter = await testFetch(
      "Server Adapter (nodejs)",
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${slug}`,
      { cache: "force-cache" }
    );

    // Direct Fetch (WordPress)
    const direct = await testFetch(
      "Direct Fetch (WordPress)",
      `${process.env.NEXT_PUBLIC_API_URL}/productapi.php?slug=${slug}`,
      { cache: "no-store" }
    );

    // Direct Fetch with Cache (WordPress)
    const directCash = await testFetch(
      "Direct Fetch (WordPress) with Cache",
      `${process.env.NEXT_PUBLIC_API_URL}/productapi.php?slug=${slug}`,
      { cache: "force-cache" }
    );

    // Client Fetch (Browser → Next.js)
    const client = await testFetch(
      "Client Fetch (Browser → API)",
      `/api/products/${slug}`,
      { cache: "no-store" }
    );

    testResults.push(serverAdapter, direct, directCash, client);
    setProductResults(testResults);
    console.table(testResults);
  }

  async function runCategoriesTest() {
    const testResults: TestResult[] = [];

    // Server Adapter (nodejs)
    const serverAdapter = await testFetch(
      "Server Adapter (nodejs)",
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`,
      { cache: "force-cache" }
    );

    // Direct Fetch (WordPress)
    const direct = await testFetch(
      "Direct Fetch (WordPress)",
      `${process.env.NEXT_PUBLIC_API_URL}/productcatapi.php`,
      { cache: "no-store" }
    );

    // Direct Fetch with Cache (WordPress)
    const directCash = await testFetch(
      "Direct Fetch (WordPress) with Cache",
      `${process.env.NEXT_PUBLIC_API_URL}/productcatapi.php`,
      { cache: "force-cache" }
    );

    // Client Fetch (Browser → Next.js)
    const client = await testFetch(
      "Client Fetch (Browser → API)",
      `/api/categories`,
      { cache: "no-store" }
    );

    testResults.push(serverAdapter, direct, directCash, client);
    setCategoryResults(testResults);
    console.table(testResults);
  }

  useEffect(() => {
    runProductTest();
    runCategoriesTest();
  }, []);

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
        🚀 Performance Benchmark
      </h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Compare performance between <b>Server Adapter (nodejs)</b>,{" "}
        <b>Direct Fetch (WordPress)</b>, and <b>Client Fetch (Browser → API)</b>{" "}
        for Products and Categories
      </p>

      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            backgroundColor: activeTab === "products" ? "#2563eb" : "#e2e8f0",
            color: activeTab === "products" ? "white" : "#555",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            marginRight: 8,
          }}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          style={{
            backgroundColor: activeTab === "categories" ? "#2563eb" : "#e2e8f0",
            color: activeTab === "categories" ? "white" : "#555",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Categories
        </button>
        <button
          onClick={() => {
            runProductTest();
            runCategoriesTest();
          }}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            marginLeft: 16,
          }}
        >
          🔄 Run Tests Again
        </button>
      </div>

      {activeTab === "products" && (
        <ResultDisplay
          results={productResults}
          title="Product Performance Benchmark"
          slug={slug}
        />
      )}
      {activeTab === "categories" && (
        <ResultDisplay
          results={categoryResults}
          title="Categories Performance Benchmark"
        />
      )}

      <p style={{ marginTop: 24, color: "#888" }}>
        More detailed results are printed in the browser <b>Console</b>.
      </p>
    </div>
  );
}