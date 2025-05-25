import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Portfoliozz</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner in navigating the ever-evolving Indian stock market.
            </p>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:7592833517" className="text-gray-300 hover:text-accent">
                +91 7592833517
              </a>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:support@portfoliozz.com" className="text-gray-300 hover:text-accent">
                support@portfoliozz.com
              </a>
            </div>
            <div className="flex items-start mb-2">
              <MapPin className="h-4 w-4 mr-2 mt-1" />
              <p className="text-gray-300">Kottayam, Kerala, India</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/core-values" className="text-gray-300 hover:text-accent transition-colors">
                  Core Values
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/complaint" className="text-gray-300 hover:text-accent transition-colors">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Disclaimer</h3>
            <p className="text-gray-300 text-sm">
              Trading and investing in the stock market involves significant risk. 
              Investments in equity shares, futures, options, and commodities carry 
              inherent risks, including the potential loss of the entire principal amount.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Registration with SEBI and certifications from NISM do not guarantee 
              returns or performance of the intermediary.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Portfoliozz. All rights reserved. SEBI Registered Research Analyst.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;