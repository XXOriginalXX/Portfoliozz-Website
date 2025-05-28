import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setAvatarOpen(false);
  }, [location]);

  const toggleNav = () => setIsOpen(!isOpen);
  const toggleServices = () => setServicesOpen(!servicesOpen);
  const toggleAvatar = () => setAvatarOpen(!avatarOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-primary/80 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center overflow-hidden h-10">
            <img
              src="/logo.png"
              alt="Logo"
              className={`h-16 w-auto object-contain ${scrolled ? '' : 'filter brightness-0 invert'}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`text-sm font-medium ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-accent'}`}>Home</Link>
            <Link to="/about" className={`text-sm font-medium ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-accent'}`}>About Us</Link>
            <Link to="/core-values" className={`text-sm font-medium ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-accent'}`}>Core Values</Link>
            <div className="relative group">
              <button
                className={`flex items-center text-sm font-medium ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-accent'}`}
                onClick={toggleServices}
              >
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {servicesOpen && (
                <div className="absolute left-0 mt-2 w-56 z-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                  <Link to="/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    All Services
                  </Link>
                </div>
              )}
            </div>
            <Link to="/terms" className={`text-sm font-medium ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-accent'}`}>Terms</Link>
            <Link to="/complaint" className={`text-sm font-medium ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-accent'}`}>Complaint</Link>
          </div>

          {/* Avatar / Login */}
          <div className="hidden md:block relative">
            {user ? (
              <div className="relative">
                <button
                  className="p-2 rounded-full bg-accent text-white"
                  onClick={toggleAvatar}
                >
                  <User size={20} />
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 ring-1 ring-black ring-opacity-5">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Personal Info</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="py-2 px-4 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleNav} className="outline-none" aria-label="Menu">
              {isOpen ? (
                <X className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 transition-all duration-300">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
              <Link to="/about" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">About Us</Link>
              <Link to="/core-values" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">Core Values</Link>
              <Link to="/services" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">Services</Link>
              <Link to="/terms" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">Terms</Link>
              <Link to="/complaint" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">Complaint</Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">Personal Info</Link>
                  <Link to="/dashboard" className="text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  <button onClick={handleLogout} className="text-sm font-medium px-3 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                </>
              ) : (
                <Link to="/login" className="text-sm font-medium px-3 py-2 text-white bg-accent rounded-md hover:bg-accent/90">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
