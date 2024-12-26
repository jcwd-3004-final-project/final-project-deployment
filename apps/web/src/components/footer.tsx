import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Menggunakan react-icons untuk ikon sosial

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Logo and Description */}
          <div className="mb-8 lg:mb-0 lg:w-1/3">
            <h2 className="text-2xl font-bold text-white mb-4">Your Company</h2>
            <p className="text-gray-400">
              Kami adalah perusahaan yang berdedikasi untuk memberikan layanan
              terbaik kepada pelanggan kami. Hubungi kami untuk informasi lebih
              lanjut.
            </p>
          </div>

          {/* Links Sections */}
          <div className="flex flex-wrap lg:w-2/3">
            {/* Company Links */}
            <div className="w-1/2 sm:w-1/3 lg:w-1/4 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Perusahaan
              </h4>
              <ul>
                <li className="mb-2">
                  <a
                    href="/about"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/careers"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Karir
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/blog"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/press"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="w-1/2 sm:w-1/3 lg:w-1/4 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Dukungan
              </h4>
              <ul>
                <li className="mb-2">
                  <a
                    href="/faq"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/help-center"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Pusat Bantuan
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/contact"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Hubungi Kami
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/privacy-policy"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div className="w-full sm:w-1/3 lg:w-1/4 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Ikuti Kami
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-200 text-2xl"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-2xl"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-400 hover:text-pink-500 transition-colors duration-200 text-2xl"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-gray-400 hover:text-blue-700 transition-colors duration-200 text-2xl"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Your Company. All Rights Reserved.
          </div>
          <div className="flex space-x-4">
            <a
              href="/terms-of-service"
              className="text-sm hover:text-blue-400 transition-colors duration-200"
            >
              Syarat Layanan
            </a>
            <a
              href="/privacy-policy"
              className="text-sm hover:text-blue-400 transition-colors duration-200"
            >
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
