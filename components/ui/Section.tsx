import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bg?: 'white' | 'cream';
  id?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '', bg = 'white', id }) => {
  const bgColors = {
    white: 'bg-white',
    cream: 'bg-cream-100',
  };

  return (
    <section 
      id={id} 
      className={`py-14 md:py-24 ${bgColors[bg]} ${className} relative overflow-hidden`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;