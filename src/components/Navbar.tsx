import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const toggleServices = () => {
    setServicesOpen(!servicesOpen);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-primary/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className={`text-2xl font-serif font-bold ${scrolled ? 'text-primary' : 'text-white'}`}>
              Portfoliozz
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? location.pathname === '/' ? 'text-primary' : 'text-gray-700'
                  : 'text-white hover:text-accent'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? location.pathname === '/about' ? 'text-primary' : 'text-gray-700'
                  : 'text-white hover:text-accent'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/core-values"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? location.pathname === '/core-values' ? 'text-primary' : 'text-gray-700'
                  : 'text-white hover:text-accent'
              }`}
            >
              Core Values
            </Link>
            <div className="relative group">
              <button
                className={`flex items-center text-sm font-medium transition-colors ${
                  scrolled
                    ? location.pathname === '/services' ? 'text-primary' : 'text-gray-700'
                    : 'text-white hover:text-accent'
                }`}
                onClick={toggleServices}
              >
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                  <Link
                    to="/services"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    All Services
                  </Link>
                </div>
              </div>
            </div>
            <Link
              to="/terms"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? location.pathname === '/terms' ? 'text-primary' : 'text-gray-700'
                  : 'text-white hover:text-accent'
              }`}
            >
              Terms
            </Link>
            <Link
              to="/complaint"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? location.pathname === '/complaint' ? 'text-primary' : 'text-gray-700'
                  : 'text-white hover:text-accent'
              }`}
            >
              Complaint
            </Link>
          </div>

          <div className="hidden md:block">
            <Link
              to="/login"
              className="py-2 px-4 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleNav}
              className="outline-none mobile-menu-button"
              aria-label="Menu"
            >
              {isOpen ? (
                <X className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isOpen ? 'block' : 'hidden'
          } mt-4 pb-4 transition-all duration-300`}
        >
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-2 rounded-md ${
                scrolled
                  ? 'hover:bg-gray-100 ' + (location.pathname === '/' ? 'text-primary' : 'text-gray-700')
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium px-3 py-2 rounded-md ${
                scrolled
                  ? 'hover:bg-gray-100 ' + (location.pathname === '/about' ? 'text-primary' : 'text-gray-700')
                  : 'text-white hover:bg-white/10'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/core-values"
              className={`text-sm font-medium px-3 py-2 rounded-md ${
                scrolled
                  ? 'hover:bg-gray-100 ' + (location.pathname === '/core-values' ? 'text-primary' : 'text-gray-700')
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Core Values
            </Link>
            <Link
              to="/services"
              className={`text-sm font-medium px-3 py-2 rounded-md ${
                scrolled
                  ? 'hover:bg-gray-100 ' + (location.pathname === '/services' ? 'text-primary' : 'text-gray-700')
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Services
            </Link>
            <Link
              to="/terms"
              className={`text-sm font-medium px-3 py-2 rounded-md ${
                scrolled
                  ? 'hover:bg-gray-100 ' + (location.pathname === '/terms' ? 'text-primary' : 'text-gray-700')
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Terms
            </Link>
            <Link
              to="/complaint"
              className={`text-sm font-medium px-3 py-2 rounded-md ${
                scrolled
                  ? 'hover:bg-gray-100 ' + (location.pathname === '/complaint' ? 'text-primary' : 'text-gray-700')
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Complaint
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium px-3 py-2 text-white bg-accent rounded-md hover:bg-accent/90"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;