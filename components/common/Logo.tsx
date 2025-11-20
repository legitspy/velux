
import React from 'react';
import { Icon } from './Icon';

interface LogoProps {
    className?: string;
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-2 text-2xl font-extrabold text-brand-primary ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <Icon name="logo" className="h-8 w-8 text-brand-secondary" />
      <span>VeluXpress</span>
    </div>
  );
};

export default Logo;