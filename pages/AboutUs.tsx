import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { Check, Award, Briefcase, Shield } from 'lucide-react';

const AboutUs = () => {
  return (
    <div>
      <Hero
        title="About Portfoliozz"
        subtitle="Your trusted partner in navigating the ever-evolving Indian stock market"
        image="https://images.pexels.com/photos/7567554/pexels-photo-7567554.jpeg"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Welcome to Portfoliozz — your trusted partner in navigating the ever-evolving Indian stock market.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Portfoliozz, my core philosophy centers on empowering investors with the knowledge, insights, and tools they need to make informed and confident investment decisions. I believe that sustainable wealth is built not just on returns, but on clarity, discipline, and well-researched strategies.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Who I Am"
            alignment="center"
          />
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Portfoliozz is the name under which I operate as a SEBI-registered research analyst, specializing in delivering precise, data-driven investment research tailored to the needs of modern investors. My services cater to individuals, professionals, and small businesses seeking reliable guidance on their financial journey. With a strong commitment to regulatory compliance and ethical practices, I strive to set new benchmarks in transparency and client satisfaction.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="What I Do"
            alignment="center"
          />
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              I offer comprehensive equity market research, trading strategies, and investment recommendations based on:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-3">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-gray-700">Fundamental & technical analysis</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-3">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-gray-700">In-depth market trend studies</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-3">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-gray-700">Sectoral and macroeconomic assessments</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-3">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-gray-700">Customized portfolio suggestions based on client risk profiles</span>
              </li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              My goal is to help you maximize returns while managing risk, using a structured, disciplined, and thoughtful approach to investing.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl font-serif font-bold mb-4">My Mission</h2>
            <p className="text-xl mb-12">
              "To bridge the gap between retail investors and quality investment insights by offering clear, credible, and client-focused research that enables informed decision-making."
            </p>
            <h2 className="text-3xl font-serif font-bold mb-4">My Vision</h2>
            <p className="text-xl">
              "To be a trusted partner in my clients' financial journeys by upholding the highest standards of research excellence and ethical advisory practices."
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Why Choose Portfoliozz?"
            alignment="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div data-aos="fade-up" data-aos-delay="100" className="flex">
              <div className="flex-shrink-0 mr-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">SEBI-Registered</h3>
                <p className="text-gray-700">Trust and compliance you can rely on</p>
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="flex">
              <div className="flex-shrink-0 mr-4">
                <Briefcase className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Experienced Analyst</h3>
                <p className="text-gray-700">Leveraging deep market understanding and analytical rigor</p>
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="flex">
              <div className="flex-shrink-0 mr-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Client-Centric</h3>
                <p className="text-gray-700">Personalized investment ideas aligned with your financial goals</p>
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="400" className="flex">
              <div className="flex-shrink-0 mr-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Transparent Approach</h3>
                <p className="text-gray-700">No hidden agendas, no misleading guarantees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Core Values"
            alignment="center"
          />
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <ul className="space-y-6">
              <li>
                <h3 className="text-xl font-bold mb-1">Integrity</h3>
                <p className="text-gray-700">I uphold the highest ethical standards and always do what's right.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold mb-1">Transparency</h3>
                <p className="text-gray-700">I communicate openly, clearly, and honestly with every client.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold mb-1">Accountability</h3>
                <p className="text-gray-700">I take full responsibility for the insights and guidance I provide.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold mb-1">Client-Centric Approach</h3>
                <p className="text-gray-700">Your financial goals are my top priority.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold mb-1">Continuous Learning & Innovation</h3>
                <p className="text-gray-700">I stay updated and adapt to evolving market trends to deliver relevant, forward-thinking strategies.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-serif font-bold mb-6">Let's Build Your Financial Future Together</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            At Portfoliozz, I don't just offer market tips—I provide strategic clarity, grounded in data, expertise, and a genuine commitment to your financial growth.
          </p>
          <button
            onClick={() => {
              const message = "Hi, I'm interested in learning more about your services after reading about your company.";
              const whatsappUrl = `https://wa.me/7592833517?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="px-8 py-4 bg-white text-accent hover:bg-gray-100 rounded-md text-lg font-medium transition-all"
          >
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;