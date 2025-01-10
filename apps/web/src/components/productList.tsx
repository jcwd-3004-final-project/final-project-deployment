// components/ProductList.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cartContext";
import { formatRupiah } from "@/utils/formatRupiah";

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  images: string[];
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  category: Category;
};

type ProductListProps = {
  products: Product[];
};

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { addToCart } = useCart();

  // Ambil hanya 5 produk terlaris
  const topProducts = products.slice(0, 5);

  if (topProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Tidak ada produk tersedia.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Produk Terlaris</h2>
      </div>

      {/* Daftar Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <Link href={`/user/product/productDetail/${product.id}`} passHref>
              <p className="flex-1">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    layout="fill"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    objectFit="contain"
                    className="rounded-t-lg bg-gray-100"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-md sm:text-lg font-bold text-gray-900 mt-1 sm:mt-1.5">
                    {formatRupiah(product.price)}
                  </p>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      product.stockQuantity > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {product.stockQuantity > 0 ? "Tersedia" : "Stok Habis"}
                  </p>
                </div>
              </p>
            </Link>
            <button
              onClick={() => addToCart(product)}
              className={`w-full py-1 sm:py-1.5 bg-green-500 text-white font-semibold rounded-b-lg ${
                product.stockQuantity > 0
                  ? "hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={product.stockQuantity <= 0}
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>

      {/* Tombol Redirect ke /user/product */}
      <div className="flex justify-center">
        <Link href="/user/product" passHref>
          <p className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
            Lihat Semua Produk
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
