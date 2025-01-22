import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto py-12 px-6">
          <h1 className="text-4xl font-bold text-center mb-6">Terms of Service</h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            These Terms of Service govern your use of the PesanAja platform. By using our services, you agree to comply
            with these terms.
          </p>

          <div className="space-y-8">
            {/* Section 1: Acceptance of Terms */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using the PesanAja platform, you agree to these Terms of Service, along with our Privacy
                Policy. If you do not agree, you must discontinue using the platform.
              </p>
            </div>

            {/* Section 2: Eligibility */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
              <p className="text-gray-600 leading-relaxed">
                You must be at least 18 years old or have the legal capacity to enter into a binding agreement in your
                jurisdiction to use PesanAja. By using our platform, you represent and warrant that you meet these
                eligibility requirements.
              </p>
            </div>

            {/* Section 3: Account Responsibilities */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Account Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed">
                When creating an account on PesanAja, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-600">
                <li>Provide accurate and up-to-date information.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Notify us immediately of unauthorized access or use of your account.</li>
              </ul>
            </div>

            {/* Section 4: Use of the Platform */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Use of the Platform</h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to use the PesanAja platform for lawful purposes only. You must not:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-600">
                <li>Violate any applicable laws or regulations.</li>
                <li>Engage in fraudulent or misleading activities.</li>
                <li>Disrupt or interfere with the operation of the platform.</li>
                <li>Copy, modify, or distribute any part of the platform without authorization.</li>
              </ul>
            </div>

            {/* Section 5: Orders and Payments */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Orders and Payments</h2>
              <p className="text-gray-600 leading-relaxed">
                All orders placed through the PesanAja platform are subject to acceptance and availability. You agree
                to:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-600">
                <li>Provide accurate payment information during checkout.</li>
                <li>Pay all applicable fees, including delivery charges.</li>
                <li>Understand that product availability and pricing may change without prior notice.</li>
              </ul>
            </div>

            {/* Section 6: Cancellation and Refunds */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">6. Cancellation and Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                Orders can only be canceled within a specific timeframe. Refunds are subject to our Refund Policy, which
                you can view on our website. Please contact customer support for assistance with cancellations or
                refunds.
              </p>
            </div>

            {/* Section 7: Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                PesanAja is not responsible for indirect, incidental, or consequential damages arising from your use of
                the platform. We are only liable for direct damages up to the amount you paid for our services.
              </p>
            </div>

            {/* Section 8: Changes to Terms */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                PesanAja reserves the right to update these Terms of Service at any time. We will notify you of
                significant changes via email or through the platform. Continued use of our services constitutes your
                acceptance of the updated terms.
              </p>
            </div>

            {/* Section 9: Governing Law */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service are governed by the laws of Indonesia. Any disputes arising from these terms will
                be resolved in the courts of Jakarta.
              </p>
            </div>

            {/* Section 10: Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email:{" "}
                <a href="mailto:support@pesanaja.com" className="text-blue-600 font-semibold">
                  support@pesanaja.com
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

export default TermsOfService;