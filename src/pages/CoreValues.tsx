import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { Users, Shield, BarChart2, Target } from 'lucide-react';

const CoreValues = () => {
  return (
    <div>
      <Hero
        title="Our Core Values"
        subtitle="The principles that guide our research and service"
        image="https://images.pexels.com/photos/4386340/pexels-photo-4386340.jpeg"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-700">
                At Portfoliozz, our core values serve as the foundation for everything we do. These principles guide our approach to research, client service, and business practices, ensuring that we consistently deliver value while upholding the highest standards of integrity and professionalism.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 items-center">
            <div 
              data-aos="fade-right"
              className="order-2 md:order-1"
            >
              <SectionTitle
                title="Our Clients, Our Priority"
                alignment="left"
              />
              <p className="text-gray-700 mb-6">
                At Portfoliozz, I place my clients at the heart of everything I do. As a SEBI-registered research analyst, my mission is to empower investors by providing clear, actionable insights and steadfast support throughout their investment journey.
              </p>
              <p className="text-gray-700 mb-6">
                I understand that navigating the stock market can be overwhelming. That's why I focus on simplifying the process—breaking down complex financial information into easy-to-understand strategies tailored to each client's unique needs.
              </p>
              <p className="text-gray-700">
                With a strong commitment to transparency and trust, I ensure timely assistance and foster lasting relationships built on reliability and integrity.
              </p>
            </div>
            <div 
              data-aos="fade-left"
              className="order-1 md:order-2 flex justify-center"
            >
              <div className="bg-white p-8 rounded-full shadow-xl h-64 w-64 flex items-center justify-center">
                <Users className="h-32 w-32 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 items-center">
            <div 
              data-aos="fade-right"
              className="flex justify-center"
            >
              <div className="bg-white p-8 rounded-full shadow-xl h-64 w-64 flex items-center justify-center">
                <Shield className="h-32 w-32 text-accent" />
              </div>
            </div>
            <div data-aos="fade-left">
              <SectionTitle
                title="Transparency at Portfoliozz"
                alignment="left"
              />
              <p className="text-gray-700 mb-6">
                At Portfoliozz, as a SEBI-registered research analyst, I consider transparency a fundamental value that guides everything I do. I am committed to providing clients with clear, honest, and timely information about my services and performance.
              </p>
              <p className="text-gray-700 mb-6">
                By maintaining open communication and sharing both successes and challenges, I build trust and ensure that my work remains aligned with each client's investment goals.
              </p>
              <p className="text-gray-700">
                My dedication to transparency empowers clients to make confident, well-informed decisions. I believe that an open and honest approach not only strengthens client relationships but also fosters continuous improvement in the services I provide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 items-center">
            <div 
              data-aos="fade-right"
              className="order-2 md:order-1"
            >
              <SectionTitle
                title="In-House Research & Dedicated Services"
                alignment="left"
              />
              <p className="text-gray-700 mb-6">
                At Portfoliozz, as a SEBI-registered research analyst, I take pride in independently conducting all research activities and services. Every analysis and recommendation is crafted with precision and thoughtfully tailored to meet the unique needs of each client.
              </p>
              <p className="text-gray-700 mb-6">
                By maintaining full control over the research process, I ensure the integrity, quality, and relevance of the insights I provide. This personalized approach allows me to build lasting relationships with clients, founded on trust and consistent value delivery.
              </p>
              <p className="text-gray-700">
                My commitment to in-house research ensures that I remain closely aligned with my clients' financial goals, offering them timely, actionable, and well-informed investment strategies.
              </p>
            </div>
            <div 
              data-aos="fade-left"
              className="order-1 md:order-2 flex justify-center"
            >
              <div className="bg-white p-8 rounded-full shadow-xl h-64 w-64 flex items-center justify-center">
                <BarChart2 className="h-32 w-32 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 items-center">
            <div 
              data-aos="fade-right"
              className="flex justify-center"
            >
              <div className="bg-white p-8 rounded-full shadow-xl h-64 w-64 flex items-center justify-center">
                <Target className="h-32 w-32 text-accent" />
              </div>
            </div>
            <div data-aos="fade-left">
              <SectionTitle
                title="Built for Durability"
                alignment="left"
              />
              <p className="text-gray-700 mb-6">
                At Portfoliozz, as a SEBI-registered research analyst, I am committed to developing trading strategies designed for long-term success. Through continuous exploration and innovation, I blend rigorous analysis with practical market insights to develop high-quality techniques tailored to each client's needs.
              </p>
              <p className="text-gray-700 mb-6">
                My unwavering focus is on helping clients succeed. I design strategies that are not only effective but also adaptable to evolving market conditions. Guided by humility and driven by ambition, I strive to equip investors with the tools and knowledge they need to achieve sustainable growth and resilience in the ever-changing world of trading.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-serif font-bold mb-6">Our Commitment to Excellence</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            These core values reflect our commitment to excellence and guide every aspect of our service. When you choose Portfoliozz, you're partnering with a research analyst who prioritizes your success and upholds the highest standards of integrity, transparency, and client care.
          </p>
          <button
            onClick={() => {
              const message = "Hi, I'm impressed by your core values and would like to learn more about your services.";
              const whatsappUrl = `https://wa.me/7592833517?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-md text-lg font-medium transition-all"
          >
            Start Your Investment Journey
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoreValues;