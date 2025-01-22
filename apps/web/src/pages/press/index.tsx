import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const Press = () => {
  const pressReleases = [
    {
      id: 1,
      title: "🚀 PesanAja Secures $10M in Series A Funding to Expand Services",
      date: "January 15, 2025",
      excerpt:
        "PesanAja has successfully raised $10 million in its latest funding round, enabling us to enhance our technology and expand our delivery network across Indonesia.",
      link: "/press/pesanaja-series-a-funding",
    },
    {
      id: 2,
      title: "📢 PesanAja Partners with Local Farmers to Promote Sustainable Shopping",
      date: "December 5, 2024",
      excerpt:
        "We're excited to announce our partnership with local farmers to bring fresh, organic, and sustainable groceries directly to your doorstep.",
      link: "/press/pesanaja-local-farmers-partnership",
    },
    {
      id: 3,
      title: "📰 PesanAja Featured in Forbes as One of the Top Grocery Apps in 2024",
      date: "November 20, 2024",
      excerpt:
        "Forbes has recognized PesanAja as a leading grocery delivery platform, highlighting our commitment to convenience, quality, and innovation.",
      link: "/press/pesanaja-forbes-feature",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">PesanAja in the News</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Stay updated with the latest media coverage, press releases, and company announcements.
          </p>

          {/* Press Releases List */}
          <div className="space-y-8">
            {pressReleases.map((release) => (
              <div key={release.id} className="p-6 border border-gray-300 rounded-lg">
                <h2 className="text-2xl font-semibold">{release.title}</h2>
                <p className="text-gray-500 text-sm">{release.date}</p>
                <p className="text-gray-600 mt-3">{release.excerpt}</p>
                <a href={release.link} className="text-blue-600 font-semibold mt-3 inline-block">
                  Read More →
                </a>
              </div>
            ))}
          </div>

          {/* Media Contact */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
            <h2 className="text-2xl font-semibold">Media Inquiries</h2>
            <p className="text-gray-600 mt-2">
              For press inquiries, please contact our media team at{" "}
              <a href="mailto:press@pesanaja.com" className="text-blue-600 font-semibold">
                press@pesanaja.com
              </a>
              .
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

export default Press;