import React from 'react';

const HeroSection = ({ title, description, backgroundImage }) => {
  return (
    <div className="relative h-64 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Overlay untuk memastikan text terbaca */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">{title}</h2>
          <p className="text-gray-100 leading-relaxed drop-shadow-md">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;