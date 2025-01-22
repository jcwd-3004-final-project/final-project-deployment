// pages/user/product/productDetail/[product_id].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { formatRupiah } from "@/utils/formatRupiah";
import { Product } from "@/components/productList";
import { useCart } from "@/context/cartContext";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
type ProductDetailProps = {
  product: Product;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{`${product.name} | Anter Aja`}</title>
        <meta name="description" content={`Detail produk ${product.name}`} />
      </Head>

      <div className="container mx-auto p-4">
        <Link href="/user/product">
          <p className="text-blue-500 hover:underline">← Kembali ke Produk</p>
        </Link>
        <div className="flex flex-col md:flex-row mt-4">
          {/* Gambar Produk */}
          <div className="md:w-1/2 relative w-full aspect-[4/3]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill // Mengganti layout="fill"
              style={{ objectFit: "contain" }} // Mengganti objectFit
              className="rounded-lg bg-gray-100"
            />
          </div>

          {/* Informasi Produk */}
          <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-xl font-semibold text-green-600 mt-2">
              {formatRupiah(product.price)}
            </p>
            <p
              className={`mt-2 ${
                product.stockQuantity > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stockQuantity > 0 ? "Tersedia" : "Stok Habis"}
            </p>
            <p className="mt-4 text-gray-700">
              <span className="font-semibold">Kategori:</span>{" "}
              {product.category.name}
            </p>
            <p className="mt-4 text-gray-700">
              <span className="font-semibold">Deskripsi:</span>{" "}
              {product.description}
            </p>

            <button
              onClick={() => addToCart(product)}
              className={`mt-6 py-2 px-4 bg-green-500 text-white font-semibold rounded-md ${
                product.stockQuantity > 0
                  ? "hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={product.stockQuantity <= 0}
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

// getStaticPaths dan getStaticProps tetap sama seperti sebelumnya

// Mendefinisikan semua path yang tersedia berdasarkan id produk
export const getStaticPaths: GetStaticPaths = async () => {
  try {


    const res = await fetch(
      "https://d29jci2p0msjlf.cloudfront.net/v1/api/products"
    );


    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const json = await res.json();

    // Pastikan respons memiliki properti 'data' yang merupakan array
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid API response: data is not an array");
    }

    const products: Product[] = json.data;

    const paths = products.map((product) => ({
      params: { product_id: product.id.toString() }, // Sesuaikan dengan nama file dinamis
    }));

    return {
      paths,
      fallback: "blocking", // Menggunakan 'blocking' untuk pengalaman pengguna yang lebih baik
    };
  } catch (error) {
    console.error(error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

// Mengambil data produk berdasarkan id
export const getStaticProps: GetStaticProps = async (context) => {
  const { product_id } = context.params!; // Sesuaikan dengan nama file dinamis

  try {


    const res = await fetch("https://d29jci2p0msjlf.cloudfront.net/v1/api/products");


    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const json = await res.json();

    // Pastikan respons memiliki properti 'data' yang merupakan array
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid API response: data is not an array");
    }

    const products: Product[] = json.data;

    const product = products.find((p) => p.id.toString() === product_id);

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product,
      },
      revalidate: 60, // ISR: mengatur ulang halaman setiap 60 detik
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
