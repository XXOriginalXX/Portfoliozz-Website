import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import CoreValues from './pages/CoreValues';
import Services from './pages/Services';
import Terms from './pages/Terms';
import Complaint from './pages/Complaint';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ScrollToTop from './utils/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';
import PortfoliozzChatbot from './components/PortfoliozzChatbot';

function AppContent() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
    });
  }, []);

  return (
    <>
      <ScrollToTop />
      <SplashScreen />
      <div className="app font-poppins text-gray-800">
        {!hideNavAndFooter && <Navbar />}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/core-values" element={<CoreValues />} />
            <Route path="/services" element={<Services />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/complaint" element={<Complaint />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
        {!hideNavAndFooter && <Footer />}
        <PortfoliozzChatbot />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
