import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Target, Users } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <Hero
        title="Make Informed Investment Decisions"
        subtitle="At Portfoliozz, we empower clients with knowledge and tools needed to navigate the dynamic world of investing with confidence."
        image="https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg"
        buttonText="Explore Services"
        buttonLink="#services"
      />

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <SectionTitle 
                title="About Portfoliozz" 
                subtitle="Your trusted partner in navigating the ever-evolving Indian stock market."
                alignment="left"
              />
              <p className="text-gray-700 mb-6">
                At Portfoliozz, I am dedicated to empowering clients with the knowledge and tools needed to make informed investment decisions. Through comprehensive research and in-depth analysis, I strive to deliver satisfactory outcomes that help clients navigate the dynamic world of investing with confidence.
              </p>
              <p className="text-gray-700 mb-6">
                Operating as a SEBI-registered research analyst, I focus on delivering precise and insightful investment research tailored to the Indian stock market. My approach blends rigorous analytical methods with a deep understanding of market dynamics, resulting in actionable recommendations aligned with each client's financial goals.
              </p>
              <Link to="/about" className="inline-flex items-center text-accent hover:underline">
                Learn more about us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div 
              data-aos="fade-left"
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/7821485/pexels-photo-7821485.jpeg"
                alt="Financial analysis"
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute -bottom-8 -left-8 bg-accent text-white p-6 rounded-lg shadow-lg max-w-xs">
                <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                <p className="text-sm">
                  "To be a trusted partner in my clients' financial journeys by upholding the highest standards of research excellence and ethical advisory practices."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Our Core Values" 
            subtitle="The principles that guide our research and service"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              data-aos="fade-up" 
              data-aos-delay="100"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Users className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Clients, Our Priority</h3>
              <p className="text-gray-700">
                We place our clients at the heart of everything we do, empowering investors with clear, actionable insights.
              </p>
            </div>
            
            <div 
              data-aos="fade-up" 
              data-aos-delay="200"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Shield className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-3">Transparency</h3>
              <p className="text-gray-700">
                We are committed to providing clients with clear, honest, and timely information about our services and performance.
              </p>
            </div>
            
            <div 
              data-aos="fade-up" 
              data-aos-delay="300"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <BarChart2 className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-3">In-House Research</h3>
              <p className="text-gray-700">
                We independently conduct all research activities, ensuring integrity, quality, and relevance of the insights we provide.
              </p>
            </div>
            
            <div 
              data-aos="fade-up" 
              data-aos-delay="400"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Target className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-3">Built for Durability</h3>
              <p className="text-gray-700">
                We develop trading strategies designed for long-term success through continuous exploration and innovation.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/core-values" 
              className="inline-flex items-center text-accent hover:underline"
            >
              Learn more about our values
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Our Services" 
            subtitle="Expert financial services tailored to your needs"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="Equity Intraday"
              price="1,000"
              duration="Month"
              highlights={[
                "Real-time stock market insights",
                "2 to 4 high-probability intraday calls per day",
                "Clear Stop Loss and Target in every call",
                "Instant call delivery via WhatsApp/Telegram"
              ]}
              whatsappNumber="7592833517"
            />
            
            <ServiceCard
              title="Option Buy"
              price="1,000"
              duration="Month"
              highlights={[
                "Minimum Capital Requirement: ₹1,00,000",
                "4 to 6 trades per week",
                "Real-time trade alerts",
                "Clear Entry, SL & Target levels in every trade"
              ]}
              whatsappNumber="7592833517"
            />
            
            <ServiceCard
              title="Option Sell (Using Strategies)"
              price="10,000"
              duration="Month"
              highlights={[
                "Minimum Capital Requirement: ₹5,00,000",
                "4 to 6 trades per week",
                "Real-time trade alerts",
                "Clear Entry, SL & Target levels in every trade"
              ]}
              whatsappNumber="7592833517"
            />
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-all transform hover:translate-y-[-2px]"
            >
              View all services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white">
        <div 
          className="container mx-auto px-4 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Make Informed Investment Decisions?
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Let's plan, grow, and invest—with purpose and confidence.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                const message = "Hi, I'm interested in learning more about your services. Can you provide more details?";
                const whatsappUrl = `https://wa.me/7592833517?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="mt-8 px-6 py-3 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md text-lg font-medium transition-all gap-3"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-6 h-6"
              />
              Contact us Today
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;