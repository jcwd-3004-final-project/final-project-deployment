import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const Careers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">Join Our Team at PesanAja</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Be part of an innovative team that's shaping the future of online grocery shopping.
          </p>

          {/* Company Culture */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Culture</h2>
            <p className="text-gray-600 leading-relaxed">
              At PesanAja, we believe in collaboration, innovation, and a customer-first approach. Our team consists of
              passionate individuals dedicated to making grocery shopping simple and convenient for everyone.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We foster an environment where creativity thrives, ideas are valued, and growth opportunities are endless.
              Whether you're in technology, logistics, customer service, or marketing, you'll be part of a team that
              values excellence and teamwork.
            </p>
          </div>

          {/* Open Positions */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Current Job Openings</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We’re always looking for talented individuals to join our growing team. Check out our latest job openings
              below:
            </p>

            <div className="space-y-6">
              {/* Example Job 1 */}
              <div className="p-6 border border-gray-300 rounded-lg">
                <h3 className="text-xl font-semibold">🚀 Software Engineer</h3>
                <p className="text-gray-600">Location: Remote | Full-time</p>
                <p className="text-gray-600 mt-2">
                  Join our tech team and help build the best grocery shopping experience. We are looking for experienced
                  developers skilled in React, TypeScript, and backend technologies.
                </p>
                <a href="mailto:gilangfauzan12@gmail.com" className="text-blue-600 font-semibold mt-3 inline-block">
                  Apply Now →
                </a>
              </div>

              {/* Example Job 2 */}
              <div className="p-6 border border-gray-300 rounded-lg">
                <h3 className="text-xl font-semibold">📦 Logistics Coordinator</h3>
                <p className="text-gray-600">Location: Jakarta, Indonesia | Full-time</p>
                <p className="text-gray-600 mt-2">
                  We need a detail-oriented logistics expert to ensure our deliveries are on time and efficient.
                </p>
                <a href="mailto:gilangfauzan12@gmail.com" className="text-blue-600 font-semibold mt-3 inline-block">
                  Apply Now →
                </a>
              </div>

              {/* Example Job 3 */}
              <div className="p-6 border border-gray-300 rounded-lg">
                <h3 className="text-xl font-semibold">📢 Digital Marketing Specialist</h3>
                <p className="text-gray-600">Location: Remote | Part-time</p>
                <p className="text-gray-600 mt-2">
                  Help us grow our online presence and engage with our community through creative marketing strategies.
                </p>
                <a href="mailto:gilangfauzan12@gmail.com" className="text-blue-600 font-semibold mt-3 inline-block">
                  Apply Now →
                </a>
              </div>
            </div>
          </div>

          {/* Employee Benefits */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
            <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
              <li>🏡 Flexible Work Environment</li>
              <li>📈 Career Growth & Learning Opportunities</li>
              <li>💰 Competitive Salaries & Benefits</li>
              <li>🚀 Work with a Passionate & Innovative Team</li>
              <li>🎉 Fun & Inclusive Work Culture</li>
            </ul>
          </div>

          {/* Application Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
            <p className="text-gray-600 leading-relaxed">
              Interested in joining PesanAja? Send your resume and cover letter to{" "}
              <a href="mailto:gilangfauzan12@gmail.com" className="text-blue-600 font-semibold">
                careers@pesanaja.com
              </a>{" "}
              and let us know why you'd be a great fit. We look forward to hearing from you!
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

export default Careers;