import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`block w-full rounded-md border-gray-600 bg-gray-700 text-white placeholder-gray-400 shadow-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm ${className}`}
      {...props}
    />
  );
};

export default Input;