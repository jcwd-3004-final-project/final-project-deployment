// components/ProductList.tsx (tidak berubah)
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
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
  );
};

export default ProductList;
