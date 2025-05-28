import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { ExternalLink, Mail, Phone } from 'lucide-react';

const Complaint = () => {
  return (
    <div>
      <Hero
        title="Complaint or Grievance Redressal System"
        subtitle="We're committed to addressing your concerns promptly and effectively"
        image="https://images.pexels.com/photos/6893825/pexels-photo-6893825.jpeg"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto" data-aos="fade-up">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <SectionTitle
                title="Investor Complaint/Grievance Redressal Mechanism"
                subtitle="At Portfoliozz, we are committed to delivering transparent, efficient, and customer-centric services"
                alignment="left"
              />

              <p className="text-lg text-gray-700 mb-8">
                Dear Traders and Investors,
              </p>
              
              <p className="text-gray-700 mb-8">
                In case you have any complaints or grievances regarding our services, we encourage you to follow the structured redressal mechanism below for prompt and effective resolution:
              </p>

              <div className="border-t border-b border-gray-200 py-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Level 1 – Initial Support</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">1.</span>
                    <span>If you have a complaint regarding the services provided by Portfoliozz, we recommend that you first reach out to your designated relationship manager or their reporting authority.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">2.</span>
                    <div>
                      <p className="mb-2">If the issue remains unresolved, you can write to us at:</p>
                      <a 
                        href="mailto:support@portfoliozz.com" 
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        support@portfoliozz.com
                      </a>
                      <p className="mt-2">A senior team member will review your concern and contact you within 2 working days (48 hours) to offer a resolution.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Still Unresolved? Approach SEBI or ODR Platform</h3>
                <p className="text-gray-700 mb-4">
                  If your grievance remains unresolved after 21 days, you may file a complaint on the SEBI SCORES platform at:
                </p>
                <a 
                  href="https://scores.sebi.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-primary hover:underline mb-4"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  https://scores.sebi.gov.in/
                </a>
                
                <p className="text-gray-700 mb-4">
                  You may also reach out to SEBI at their toll-free helpline:
                </p>
                <p className="flex items-center text-gray-700 mb-6">
                  <Phone className="h-4 w-4 mr-2" />
                  1800 22 7575 / 1800 266 7575
                </p>
                
                <p className="text-gray-700 mb-4">
                  Additionally, as per SEBI Circular No. SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131 dated July 31, 2023, investors may use the Online Dispute Resolution (ODR) Portal for conciliation and arbitration related to securities market disputes.
                </p>
                <a 
                  href="https://smartodr.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Access the ODR Portal here: https://smartodr.in
                </a>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-3">
                  At Portfoliozz, your trust matters. We strive to resolve every concern with fairness, speed, and transparency.
                </p>
                <p className="text-gray-700">
                  For queries, feedback, or further assistance, feel free to connect with us through the appropriate channels mentioned above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-serif font-bold mb-6">We Value Your Feedback</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your feedback helps us improve our services. We're committed to addressing your concerns promptly and effectively.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:support@portfoliozz.com"
              className="px-6 py-3 bg-white text-primary hover:bg-gray-100 rounded-md font-medium transition-all inline-flex items-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </a>
            <button
              onClick={() => {
                const message = "Hello, I would like to provide feedback about your services.";
                const whatsappUrl = `https://wa.me/7592833517?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-md font-medium transition-all inline-flex items-center"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Complaint;