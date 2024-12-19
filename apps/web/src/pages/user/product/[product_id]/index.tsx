// File: src/user/product/[product_id]/index.tsx

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from '../../../../components/navbar';
import Footer from '../../../../components/footer';

// Note:
// Currently using a mock product data. 
// Next week you can replace the mock data fetch with Prisma client calls such as:
//
// const prisma = new PrismaClient();
// const product = await prisma.product.findUnique({
//   where: { id: Number(product_id) },
//   include: { images: true, category: true }, // etc as needed
// });
//
// For now, we’ll just use a placeholder mock JSON.

interface Image {
  id: number;
  url: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: Image[];
}

interface ProductPageProps {
  product: Product;
}

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">

          {/* Product Images and Basic Info */}
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
              <img
                src={product.images[0]?.url || '/placeholder.png'}
                alt={product.name}
                className="w-full h-auto max-h-80 object-cover rounded-md shadow"
              />
            </div>

            {/* Product Details Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              <p className="text-gray-600 text-sm mb-4">{product.category.name}</p>
              <p className="text-gray-800 text-base mb-4">{product.description}</p>

              {/* Quantity and Price */}
              <div className="flex items-center mb-4">
                <div className="flex items-center border border-gray-300 rounded-md mr-4">
                  <button
                    onClick={handleDecrease}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-3 text-black">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <span className="text-2xl text-black *:font-semibold">${(product.price * quantity).toFixed(2)}</span>
              </div>

              {/* Action Button */}
              <button className="bg-green-600 text-white py-3 px-6 rounded-md text-center hover:bg-green-700 transition-colors">
                Add To Basket
              </button>
            </div>
          </div>

          {/* Additional Info Sections */}
          <div className="mt-8 space-y-6">
            {/* Product Detail */}
            <div>
              <button
                className="w-full flex justify-between items-center py-3 border-b border-gray-300 focus:outline-none"
                // In a real scenario, you might use state to toggle this content
              >
                <span className="font-semibold">Product Detail</span>
                <span>▼</span>
              </button>
              <div className="mt-2 text-gray-600 text-sm">
                {/* Just a static description for now */}
                Apples are nutritious. Apples may be good for weight loss. Apples may be good for your heart as part of a healthful and varied diet.
              </div>
            </div>

            {/* Nutrition Info */}
            <div>
              <button
                className="w-full flex justify-between items-center py-3 border-b border-gray-300 focus:outline-none"
                // Toggle content similarly if needed
              >
                <span className="font-semibold">Nutritions (per 100g)</span>
                <span>▼</span>
              </button>
              <div className="mt-2 text-gray-600 text-sm">
                {/* Mock nutrition info */}
                Calories: 52 kcal <br/>
                Carbohydrates: 14 g <br/>
                Fiber: 2.4 g <br/>
                Sugars: 10 g <br/>
                Vitamin C: 7% of the RDI
              </div>
            </div>

            {/* Reviews */}
            <div>
              <button
                className="w-full flex justify-between items-center py-3 border-b border-gray-300 focus:outline-none"
              >
                <span className="font-semibold">Review</span>
                <span>▼</span>
              </button>
              <div className="mt-2 text-gray-600 text-sm">
                {/* Mock review data */}
                <div className="flex items-center mb-2">
                  {/* Just a static star rating */}
                  <span className="text-yellow-500">★★★★☆</span>
                  <span className="ml-2 text-sm text-gray-500">4.0 (120 reviews)</span>
                </div>
                <p className="text-gray-800 mb-2">
                  "Delicious and fresh! Perfect sweetness and crunchiness. Will buy again."
                </p>
                <p className="text-gray-500 text-xs">
                  - John Doe, 2 days ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Mock data
// In real scenario, fetch from prisma or API
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { product_id } = context.query;

  // Mock product data
  const product: Product = {
    id: Number(product_id),
    name: "Natural Red Apple",
    description: "Fresh and crispy red apples directly from the farm.",
    price: 4.99,
    category: {
      id: 1,
      name: "Fruits"
    },
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
      }
    ]
  };

  return {
    props: {
      product,
    },
  };
};

export default ProductPage;
