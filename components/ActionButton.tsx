
import React, { useState } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  children,
  variant = 'primary',
  size = 'medium',
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white elevation-2 hover:elevation-3',
      secondary: 'bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 hover:border-blue-300 elevation-1 hover:elevation-2',
      success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white elevation-2 hover:elevation-3',
      warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white elevation-2 hover:elevation-3',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white elevation-2 hover:elevation-3'
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      small: 'px-4 py-2 text-sm',
      medium: 'px-6 py-3 text-base',
      large: 'px-8 py-4 text-lg'
    };
    return sizes[size];
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`
        btn-material ripple-effect
        ${getSizeClasses()}
        ${getVariantClasses()}
        font-semibold rounded-lg
        disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:border-gray-300
        transition-all duration-200 ease-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
        relative overflow-hidden
        ${isPressed ? 'elevation-1' : ''}
        ${disabled ? 'opacity-60 grayscale' : ''}
        ${className}
      `}
      aria-disabled={disabled}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200 rounded-lg pointer-events-none"></span>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

export default ActionButton;