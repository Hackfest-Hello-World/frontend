import React, { useEffect, useState } from 'react';

const Banner = ({ show, onClose, icon, title, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 30000); // Wait for fade-out animation to complete
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className={`fixed top-20 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg w-full mx-4 flex items-start">
        <div className="mr-3 text-2xl">{icon}</div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export { Banner };