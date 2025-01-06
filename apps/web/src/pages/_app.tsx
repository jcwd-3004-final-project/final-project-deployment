import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/cartContext";
import { UserProvider } from "@/context/userContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
         <UserProvider>
      <Component {...pageProps} />
         </UserProvider>
    </CartProvider>
  );
}
