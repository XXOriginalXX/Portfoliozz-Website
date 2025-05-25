import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const services = [
    {
      title: "Equity Intraday",
      price: "1,000",
      duration: "Month",
      highlights: [
        "Real-time stock market insights",
        "Quick entry & exit-based trading strategies",
        "2 to 4 high-probability intraday calls per day",
        "Instant call delivery via WhatsApp/Telegram",
        "Clear Stop Loss and Target in every call"
      ],
      whatsappNumber: "7592833517"
    },
    {
      title: "Option Buy",
      price: "1,000",
      duration: "Month",
      highlights: [
        "Minimum Capital Requirement: ₹1,00,000",
        "4 to 6 trades per week",
        "Real-time trade alerts via WhatsApp/Telegram",
        "Clear Entry, SL & Target levels in every trade"
      ],
      whatsappNumber: "7592833517"
    },
    {
      title: "Option Sell (Using Strategies)",
      price: "10,000",
      duration: "Month",
      highlights: [
        "Minimum Capital Requirement: ₹5,00,000",
        "4 to 6 trades per week",
        "Real-time trade alerts via WhatsApp/Telegram",
        "Clear Entry, SL & Target levels in every trade"
      ],
      whatsappNumber: "7592833517"
    },
    {
      title: "Long-Term Portfolio Creation & Maintenance",
      price: "15,000",
      duration: "Month",
      highlights: [
        "Tailor-made portfolios for long-term wealth",
        "Focus on high-quality, fundamentally strong stocks",
        "Sector-wise allocation based on market trends",
        "Periodic review and rebalancing for performance",
        "Detailed reporting & ongoing advisory support"
      ],
      whatsappNumber: "7592833517"
    },
    {
      title: "Multibagger",
      price: "1,50,000",
      duration: "Year",
      highlights: [
        "3 to 4 handpicked high-potential stocks",
        "Minimum 2 years holding period",
        "Potential to deliver 2x to 5x returns over time",
        "Backed by deep fundamental research",
        "Regular monitoring and long-term updates"
      ],
      whatsappNumber: "7592833517"
    },
    {
      title: "Short Term Holding Stocks",
      price: "6,000",
      duration: "3 Months",
      highlights: [
        "Holding Period: Typically 2 to 8 weeks",
        "6-8 trades per month",
        "Based on technical setups and sectoral momentum",
        "Potential for 8-20% movement in short span",
        "Clear Entry, Stop Loss & Targets"
      ],
      whatsappNumber: "7592833517"
    },
    {
      title: "Index Futures - High Risk High Reward",
      price: "4,000",
      duration: "2 Months",
      highlights: [
        "Trading Instrument: NIFTY & BANKNIFTY Futures",
        "Risk Level: High (for risk-capable traders)",
        "Trade Frequency: 4-6 trades per week",
        "High-conviction trades with clear entry/exit logic",
        "Real-time alerts via WhatsApp/Telegram"
      ],
      whatsappNumber: "7592833517"
    },
    {
      title: "Commodity Trading",
      price: "10,000",
      duration: "3 Months",
      highlights: [
        "Instruments: Gold, Silver, Crude Oil, Natural Gas, Copper & more",
        "Trade Type: Intraday and Positional",
        "Frequency: 3-5 trades per week",
        "Technically backed calls with defined risk parameters",
        "Live market alerts via WhatsApp/Telegram"
      ],
      whatsappNumber: "7592833517"
    }
  ];

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
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                price={service.price}
                duration={service.duration}
                highlights={service.highlights}
                whatsappNumber={service.whatsappNumber}
                bgColor={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              />
            ))}
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
            <button
              onClick={() => {
                const message = "Hi, I'm interested in learning more about your services. Can you provide more details?";
                const whatsappUrl = `https://wa.me/7592833517?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="mt-8 px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-md text-lg font-medium transition-all"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;