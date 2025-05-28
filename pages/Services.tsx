import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseconfig';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const servicesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Handle error gracefully - show empty array or error message
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <Hero
        title="Our Services"
        subtitle="Expert financial guidance tailored to your investment goals"
        image="https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Financial Services"
            subtitle="Choose the service that best fits your investment strategy and goals"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service, index) => (
                <ServiceCard
                  key={service.id} // Use service.id instead of index for better React performance
                  title={service.title}
                  price={service.price}
                  duration={service.duration}
                  highlights={service.highlights}
                  whatsappNumber={service.whatsappNumber}
                  bgColor={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No services available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl font-serif font-bold mb-6">Our Commitment to You</h2>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>At Portfoliozz, quality trading and efficiency in service delivery are our top priorities.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>We offer highly customer-oriented support, with every service designed to focus on your trading satisfaction.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>If you're not satisfied with the performance during the service period, we may consider extending your subscription as a gesture of goodwill.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>Additionally, we provide on-call assistance, ensuring that you're never left without guidance when you need it most.</span>
              </li>
            </ul>
            <p className="text-xl mt-6">
              Your trust matters — and we're here to support you at every step of your trading journey.
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
        </div>
      </section>
    </div>
  );
};

export default Services;