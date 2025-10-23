"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: string | number;
  description?: string;
  image?: string;
}

export default function SingleProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-8">⏳ در حال بارگذاری...</p>;

  if (!product) return <p className="p-8 text-red-500">محصول یافت نشد 😕</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {product.name}
        </h1>

        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            className="rounded-md mb-4 w-full"
            width={100}
            height={100}
          />
        )}

        <p className="text-green-600 font-bold text-lg mb-2">
          💰 قیمت: {product.price} تومان
        </p>

        {product.description && (
          <p className="text-gray-600 leading-relaxed mb-4">
            {product.description}
          </p>
        )}

        <p className="text-sm text-gray-400">ID: {product.id}</p>
      </div>
    </div>
  );
}
