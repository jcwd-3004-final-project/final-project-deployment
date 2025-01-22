import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "🛒 5 Essential Grocery Shopping Tips to Save Money",
      date: "January 10, 2025",
      excerpt:
        "Grocery shopping can be expensive if you're not careful. Here are five expert tips to help you save money while still getting the best quality food.",
      link: "/blog/grocery-shopping-tips",
    },
    {
      id: 2,
      title: "🥦 The Benefits of Buying Fresh & Local Groceries",
      date: "December 22, 2024",
      excerpt:
        "Discover why choosing locally sourced and fresh produce can improve your health and support local businesses.",
      link: "/blog/benefits-of-local-groceries",
    },
    {
      id: 3,
      title: "🚀 How PesanAja is Revolutionizing Online Grocery Shopping",
      date: "November 15, 2024",
      excerpt:
        "Learn how PesanAja is making grocery shopping more convenient, efficient, and eco-friendly with innovative technology.",
      link: "/blog/pesanaja-revolution",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">PesanAja Blog</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Stay updated with the latest grocery shopping tips, food trends, and PesanAja news.
          </p>

          {/* Blog Post List */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="p-6 border border-gray-300 rounded-lg">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-gray-500 text-sm">{post.date}</p>
                <p className="text-gray-600 mt-3">{post.excerpt}</p>
                <a href={post.link} className="text-blue-600 font-semibold mt-3 inline-block">
                  Read More →
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Blog;