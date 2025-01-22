import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const FAQ = () => {
  const faqs = [
    {
      question: "What is PesanAja?",
      answer:
        "PesanAja is an online grocery platform that allows you to shop for fresh and high-quality groceries and have them delivered directly to your doorstep.",
    },
    {
      question: "How does PesanAja work?",
      answer:
        "Simply browse our wide range of products, add them to your cart, and proceed to checkout. We’ll take care of the rest and deliver your groceries to you as quickly as possible.",
    },
    {
      question: "Where does PesanAja deliver?",
      answer:
        "We currently deliver to major cities across Indonesia. Check your location during checkout to see if we deliver to your area.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods, including credit/debit cards, online banking, and digital wallets like OVO and GoPay.",
    },
    {
      question: "Can I return an item if I’m not satisfied?",
      answer:
        "Yes, we have a hassle-free return policy. If you receive a damaged or incorrect item, please contact our customer support team within 24 hours.",
    },
    {
      question: "Is there a delivery fee?",
      answer:
        "Delivery fees depend on your location and the total value of your order. Orders above a certain amount may qualify for free delivery.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@pesanaja.com or through the live chat feature on our app and website.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Have questions? We’ve got answers! Browse our FAQ to learn more about PesanAja.
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 border border-gray-300 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold">{faq.question}</h2>
                <p className="text-gray-600 mt-3">{faq.answer}</p>
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

export default FAQ;