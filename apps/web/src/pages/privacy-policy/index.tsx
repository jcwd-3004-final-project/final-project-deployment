import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Your privacy is important to us. Learn how PesanAja collects, uses, and protects your personal information.
          </p>

          <div className="space-y-8">
            {/* Section 1: Information Collection */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">
                When you use PesanAja, we may collect the following information:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-600">
                <li>Personal information such as your name, email address, and phone number.</li>
                <li>Payment information for processing transactions.</li>
                <li>Location data to optimize delivery services.</li>
                <li>Technical data like device type, browser, and usage patterns.</li>
              </ul>
            </div>

            {/* Section 2: How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-600">
                <li>Provide, operate, and improve our services.</li>
                <li>Process your orders and manage your account.</li>
                <li>Communicate with you about updates, promotions, or issues.</li>
                <li>Ensure secure and efficient payment processing.</li>
              </ul>
            </div>

            {/* Section 3: Data Sharing */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. However, we may share your data with trusted third parties
                under the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-600">
                <li>With service providers that help us operate our platform (e.g., payment processors, delivery services).</li>
                <li>To comply with legal obligations or respond to lawful requests.</li>
                <li>In the event of a business transfer such as a merger or acquisition.</li>
              </ul>
            </div>

            {/* Section 4: Data Security */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We take the protection of your personal data seriously. PesanAja uses industry-standard encryption,
                secure servers, and other technologies to safeguard your information.
              </p>
            </div>

            {/* Section 5: Your Rights */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                As a user, you have the right to:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-600">
                <li>Access, update, or delete your personal information.</li>
                <li>Request a copy of the data we hold about you.</li>
                <li>Opt-out of marketing communications.</li>
              </ul>
              <p className="text-gray-600 mt-4">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@pesanaja.com" className="text-blue-600 font-semibold">
                  privacy@pesanaja.com
                </a>
                .
              </p>
            </div>

            {/* Section 6: Changes to This Policy */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                regulatory, or operational reasons. We encourage you to review this page periodically for updates.
              </p>
            </div>

            {/* Section 7: Contact Us */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy or how your information is handled, please contact
                us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email:{" "}
                <a href="mailto:privacy@pesanaja.com" className="text-blue-600 font-semibold">
                  privacy@pesanaja.com
                </a>
              </p>
              <p className="text-gray-600">
                Address: PesanAja HQ, Jakarta, Indonesia
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default PrivacyPolicy;