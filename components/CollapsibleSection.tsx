import React, { useState, ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: ReactNode;
  children: ReactNode;
  initiallyOpen?: boolean;
  className?: string;
  titleClassName?: string;
  iconSize?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  initiallyOpen = false,
  className = '',
  titleClassName = '',
  iconSize = 'w-5 h-5'
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`rounded-md border border-gray-300 overflow-hidden ${className}`}>
      <button
        onClick={toggleOpen}
        className={`w-full flex justify-between items-center p-3 text-left focus:outline-none transition-colors duration-150 ease-in-out ${isOpen ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-50'} ${titleClassName}`}
        aria-expanded={isOpen}
      >
        <div className="font-medium text-gray-700">{title}</div>
        <svg
          className={`transform transition-transform duration-200 ease-in-out text-gray-500 ${iconSize} ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-200 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;