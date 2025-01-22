import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">About PesanAja</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Your trusted online grocery store, delivering fresh and quality products right to your doorstep.
          </p>

          {/* Company History */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              PesanAja was founded in 2021 with a simple mission: to make grocery shopping easier, faster, and more
              convenient for everyone. What started as a small local delivery service has now grown into a leading
              online marketplace, connecting customers with local markets and farms to ensure fresh and high-quality
              groceries.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our journey began when our founders, frustrated with long checkout lines and inconsistent product
              availability, envisioned a platform where anyone could order groceries from the comfort of their home.
              Through innovation and dedication, PesanAja has transformed the way people shop for daily essentials.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At PesanAja, we strive to provide an easy, reliable, and efficient grocery shopping experience. We work
              closely with local suppliers to offer fresh products at competitive prices, all while ensuring fast and
              secure delivery.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a future where grocery shopping is entirely hassle-free, sustainable, and accessible to
              everyone. By leveraging technology, we aim to create a seamless and eco-friendly shopping experience that
              benefits both consumers and local businesses.
            </p>
          </div>

          {/* Why Choose Us? */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Why Choose PesanAja?</h2>
            <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
              <li>🚀 Fast & Reliable Delivery</li>
              <li>🛒 Wide Range of Fresh Products</li>
              <li>💰 Affordable Prices & Exclusive Deals</li>
              <li>📦 Easy Returns & Customer Support</li>
              <li>🌱 Sustainable & Locally Sourced Items</li>
            </ul>
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default About;