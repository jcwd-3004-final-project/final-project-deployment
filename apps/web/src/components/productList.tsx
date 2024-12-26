import React from "react";

export type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  stock: number;
  category: string;
};

type ProductListProps = {
  products: Product[];
};

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
            
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-xl font-bold text-gray-900 mt-2">
              ${product.price}
            </p>
            <p
              className={`text-sm mt-1 ${
                product.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <button
              className={`w-full mt-4 py-2 bg-green-500 text-white font-semibold rounded-md ${
                product.stock > 0
                  ? "hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
