import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const HelpCenter = () => {
  const helpSections = [
    {
      title: "FAQs",
      description: "Find answers to commonly asked questions about PesanAja.",
      link: "/faq",
    },
    {
      title: "Order Issues",
      description:
        "Having trouble with an order? Learn how to resolve common problems or contact us for help.",
      link: "wa.me/6287855294573",
    },
    {
      title: "Payment Support",
      description: "Get assistance with payment methods, refunds, and transaction issues.",
      link: "wa.me/6287855294573",
    },
    {
      title: "Delivery Information",
      description: "Learn about delivery times, fees, and tracking your order.",
      link: "wa.me/6287855294573",
    },
    {
      title: "Contact Us",
      description: "Need further assistance? Reach out to our customer support team.",
      link: "wa.me/6287855294573",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">Help Center</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Need assistance? Explore our Help Center to find answers and solutions to your questions.
          </p>

          <div className="space-y-8">
            {helpSections.map((section, index) => (
              <div
                key={index}
                className="p-6 border border-gray-300 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-gray-600 mt-3">{section.description}</p>
                <a
                  href={section.link}
                  className="text-blue-600 font-semibold mt-3 inline-block"
                >
                  Learn More →
                </a>
              </div>
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
            <h2 className="text-2xl font-semibold">Can’t Find What You’re Looking For?</h2>
            <p className="text-gray-600 mt-2">
              Contact our support team directly at{" "}
              <a href="mailto:gilangfauzan12@gmail.com" className="text-blue-600 font-semibold">
                support@pesanaja.com
              </a>{" "}
              or use the live chat feature in our app.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default HelpCenter;