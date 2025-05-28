interface SectionTitleProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  lightMode?: boolean;
}

const SectionTitle = ({ 
  title, 
  subtitle, 
  alignment = 'center',
  lightMode = false
}: SectionTitleProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const colorClasses = lightMode ? 'text-white' : 'text-primary';
  const subtitleColorClasses = lightMode ? 'text-gray-200' : 'text-gray-600';

  return (
    <div 
      data-aos="fade-up"
      className={`max-w-2xl mb-12 ${alignmentClasses[alignment]}`}
    >
      <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${colorClasses}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${subtitleColorClasses}`}>
          {subtitle}
        </p>
      )}
      <div className={`w-20 h-1 mt-4 ${lightMode ? 'bg-accent' : 'bg-accent'} ${
        alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''
      }`}></div>
    </div>
  );
};

export default SectionTitle;