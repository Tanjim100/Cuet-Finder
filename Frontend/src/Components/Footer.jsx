import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Logo Section */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/Logo 1.png"
              alt="Logo"
              className="h-26 w-auto"
            />
          </div>

          {/* Footer Contents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
            {/* Help Section */}
            <div className="text-center sm:text-left">
              <h4 className="text-xl font-bold mb-4">Help</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    Customer Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Section */}
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacts Section */}
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold mb-4">Contacts</h4>
              <ul className="space-y-2">
                <li>Phone: +8801516536056</li>
                <li>
                  Email:{" "}
                  <a
                    href="mailto:cuetfinder@gmail.com"
                    className="hover:text-amber-500 transition-colors"
                  >
                    cuetfinder@gmail.com
                  </a>
                </li>
              </ul>
              <div className="mt-4">
                <img
                  src="/images/social icons.png"
                  alt="Social Icons"
                  className="h-10 w-auto mx-auto sm:mx-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CUETFinders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;