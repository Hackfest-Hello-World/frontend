import React, { useEffect, useState } from 'react';

const Banner = ({ show, onClose, icon, title, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation to complete
      }, 3000); // Changed from 30000 to 3000 (3 seconds) to match your description
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className={`w-full transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      <div className="bg-red-500 text-white p-3 rounded-lg shadow-lg mx-4 flex items-start">
        <div className="mr-3 text-2xl">{icon}</div>
        <div>
          <h3 className="font-bold text-md">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export { Banner };