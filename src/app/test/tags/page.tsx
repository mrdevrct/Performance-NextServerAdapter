import React from "react";

// تعریف تایپ برای پاسخ تابع testFetch
interface FetchResult {
  label: string;
  status: number;
  time: string;
  cacheHeader: string;
  data: unknown; // اگر ساختار داده API مشخص است، می‌توانید به جای unknown تایپ دقیق‌تری تعریف کنید
}

// تابع testFetch با تایپ‌های TypeScript
async function testFetch(
  label: string,
  url: string,
  options: RequestInit = {}
): Promise<FetchResult> {
  const start = performance.now();
  const res = await fetch(url, options);
  const end = performance.now();

  const data = await res.json();
  const time = (end - start).toFixed(2);
  const cacheHeader =
    res.headers.get("x-cache") ||
    res.headers.get("cf-cache-status") ||
    res.headers.get("x-cache-info") ||
    "N/A";

  return { label, status: res.status, time, cacheHeader, data };
}


// تابع صفحه به صورت TypeScript
const Page= async () => {
  console.log("🚀 شروع تست Edge + Warm Cache Performance");

  // ---------- 1️⃣ Server Adapter (بار اول = cold cache) ----------
  const first = await testFetch(
    "Server Adapter (cold)",
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/tags`,
    { cache: "force-cache" }
  );

  // ---------- 2️⃣ Server Adapter (بار دوم = warm cache) ----------
  const second = await testFetch(
    "Server Adapter (warm)",
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/tags`,
    { cache: "force-cache" }
  );

  // ---------- 3️⃣ Direct Fetch ----------
  const direct = await testFetch(
    "Direct Fetch",
    `${process.env.NEXT_PUBLIC_API_URL}/producttagapi.php`,
    { cache: "no-store" }
  );

  // ---------- نمایش در صفحه ----------
  const results: FetchResult[] = [first, second, direct];

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>⚡ تست Edge Runtime + Cache (Cold vs Warm)</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th align="left">Type</th>
            <th align="left">Status</th>
            <th align="left">Time (ms)</th>
            <th align="left">Cache</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.label} style={{ borderBottom: "1px solid #eee" }}>
              <td>{r.label}</td>
              <td>{r.status}</td>
              <td>{r.time}</td>
              <td>{r.cacheHeader}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: "20px 0" }} />

      <details>
        <summary>📦 داده پاسخ (Edge)</summary>
        <pre>{JSON.stringify(results[1].data, null, 2)}</pre>
      </details>

      <p style={{ marginTop: 20, color: "#999" }}>
        زمان <b>Cold</b> یعنی بار اول (قبل از کش). زمان <b>Warm</b> یعنی بار دوم
        (با کش فعال Edge).
      </p>
    </div>
  );
};

// تنظیم داینامیک برای Next.js
export const dynamic = "force-dynamic";

export default Page;