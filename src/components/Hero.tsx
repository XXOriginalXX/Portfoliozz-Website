import { ArrowRight } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
}

const Hero = ({ title, subtitle, image, buttonText, buttonLink }: HeroProps) => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {buttonText && buttonLink && (
            <a
              href={buttonLink}
              className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-md hover:bg-accent/90 transition-all transform hover:translate-y-[-2px]"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      {/* Decorative Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <span className="animate-scroll-indicator"></span>
        </div>
      </div>
    </div>
  );
};

export default Hero;