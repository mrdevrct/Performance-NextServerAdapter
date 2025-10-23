"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string | number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">⏳ در حال بارگذاری محصولات...</p>;

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🛍️ لیست محصولات</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="block p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all"
          >
            <div className="text-gray-800 font-semibold text-lg mb-1">
              {p.name}
            </div>
            <div className="text-gray-500 text-sm mb-2">ID: {p.id}</div>
            <div className="text-green-600 font-bold">{p.price} تومان</div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-500 mt-6">محصولی یافت نشد 😕</p>
      )}
    </div>
  );
}
