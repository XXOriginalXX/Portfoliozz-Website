import { Apple as WhatsApp } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  price: string;
  duration: string;
  highlights: string[];
  whatsappNumber: string;
  bgColor?: string;
}

const ServiceCard = ({
  title,
  price,
  duration,
  highlights,
  whatsappNumber,
  bgColor = 'bg-white',
}: ServiceCardProps) => {
  const handleWhatsAppClick = () => {
    const message = `Hi, I'm interested in the ${title} service.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      data-aos="fade-up"
      className={`${bgColor} rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col h-full border border-gray-100`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold font-serif text-primary mb-2">{title}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-2xl font-bold text-accent">₹{price}</span>
          <span className="text-gray-500 ml-2">/{duration}</span>
        </div>
      </div>

      <div className="flex-grow">
        <ul className="space-y-2 mb-6">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span className="text-sm text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleWhatsAppClick}
        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center"
      >
        <WhatsApp className="mr-2 h-5 w-5" />
        <span>Inquire via WhatsApp</span>
      </button>
    </div>
  );
};

export default ServiceCard;