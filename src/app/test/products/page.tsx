"use client";
import React, { useState, useEffect } from "react";

// تعریف تایپ برای محصول
interface Product {
  id: number;
  name: string;
  price: number;
  // سایر فیلدهای مورد نیاز
}

// تعریف تایپ برای نتایج تست
interface TestResult {
  label: string;
  status: number;
  time: string;
  cacheHeader: string;
  products?: Product[]; // اضافه کردن محصولات به نتیجه
}

// تابع تست عمومی با تایپ‌ها
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

  // دریافت داده‌های JSON از پاسخ
  const data = await res.json();

  return {
    label,
    status: res.status,
    time,
    cacheHeader,
    products: data.products || data, // فرض بر این است که API محصولات را در قالب products یا مستقیم برمی‌گرداند
  };
}

const ProductsBenchmarkPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);

  async function runTest() {
    const testResults: TestResult[] = [];

    // 1️⃣ Server Adapter (nodejs API Route)
    const serverAdapter = await testFetch(
      "Server Adapter (nodejs)",
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?per_page=5`,
      { cache: "force-cache" }
    );

    // 2️⃣ Direct Fetch (وردپرس مستقیم)
    const direct = await testFetch(
      "Direct Fetch (WordPress)",
      `${process.env.NEXT_PUBLIC_API_URL}/productsapi.php?per_page=5`,
      { cache: "no-store" }
    );

    // 3️⃣ Client Fetch (مرورگر)
    const client = await testFetch(
      "Client Fetch (Browser → API)",
      `/api/products?per_page=5`,
      { cache: "no-store" }
    );

    testResults.push(serverAdapter, direct, client);
    setResults(testResults);

    console.log("📊 Benchmark Results:", testResults);
  }

  // اجرا روی mount
  useEffect(() => {
    runTest();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>⚡ تست عملکرد محصولات (3 روش مختلف)</h2>
      <p style={{ color: "#888" }}>
        مقایسه بین Server Adapter (nodejs)، Direct Fetch (WordPress) و Client
        Fetch (Browser)
      </p>

      <button
        onClick={runTest}
        style={{
          padding: "8px 16px",
          borderRadius: 6,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        🔄 اجرای دوباره تست
      </button>

      {/* جدول بنچمارک */}
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginTop: 8,
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th align="left">نوع تست</th>
            <th align="left">Status</th>
            <th align="left">زمان پاسخ (ms)</th>
            <th align="left">Cache</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              <td>{r.label}</td>
              <td>{r.status}</td>
              <td>{r.time}</td>
              <td>{r.cacheHeader}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* نمایش محصولات */}
      <div style={{ marginTop: 24 }}>
        <h3>📋 لیست محصولات</h3>
        {results.map((result, index) => (
          <div key={index} style={{ marginBottom: 24 }}>
            <h4>{result.label}</h4>
            {result.products && result.products.length > 0 ? (
              <ul>
                {result.products.map((product) => (
                  <li key={product.id}>
                    {product.name} - {product.price} تومان
                  </li>
                ))}
              </ul>
            ) : (
              <p>محصولی برای نمایش وجود ندارد.</p>
            )}
          </div>
        ))}
      </div>

      {/* نمودار سرعت پاسخ */}
      <div style={{ marginTop: 24 }}>
        <h3>📈 نمودار ساده سرعت پاسخ</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          {results.map((r, i) => (
            <div
              key={i}
              title={`${r.label}: ${r.time} ms`}
              style={{
                height: `${Math.min(Number(r.time), 300)}px`,
                width: "40px",
                backgroundColor: "#4ade80",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
                color: "#000",
                fontSize: 10,
                borderRadius: 4,
              }}
            >
              {r.time}
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 20, color: "#aaa" }}>
        ⚙️ نتایج را در کنسول مرورگر (Console) نیز می‌توانید ببینید.
      </p>
    </div>
  );
};

export default ProductsBenchmarkPage;
