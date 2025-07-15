import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type LogoProps = {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  variant?: 'black' | 'white';
};

const sizeClasses = {
  small: { width: 30, height: 30 },
  medium: { width: 40, height: 40 },
  large: { width: 130, height: 130 },
  xlarge: { width: 170, height: 170 },
  xxlarge: { width: 360, height: 360 },
};

const Logo: React.FC<LogoProps> = ({ size = 'medium', variant = 'white' }) => {
  const logoSrc = variant === 'white' ? '/images/logo-white.png' : '/images/logo-black.png';
  
  return (
    <Link href='/' className='flex items-center space-x-2'>
      <Image
        src={logoSrc}
        alt={`StellarOne Logo - ${variant}`}
        width={sizeClasses[size].width}
        height={sizeClasses[size].height}
        priority
        style={{ width: 'auto', height: 'auto' }}
      />
    </Link>
  );
};

export default Logo;