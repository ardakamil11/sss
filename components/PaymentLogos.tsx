import React from 'react';
import iyzicoLogo from '@/assets/iyzico-logo.png';
import visaLogo from '@/assets/visa-logo.png';
import mastercardLogo from '@/assets/mastercard-logo.png';

interface PaymentLogosProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PaymentLogos: React.FC<PaymentLogosProps> = ({ 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>Güvenli ödeme:</span>
      </div>
      <img 
        src={iyzicoLogo} 
        alt="iyzico ile Öde" 
        className={`${sizeClasses[size]} object-contain`}
      />
      <img 
        src={visaLogo} 
        alt="Visa" 
        className={`${sizeClasses[size]} object-contain`}
      />
      <img 
        src={mastercardLogo} 
        alt="Mastercard" 
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};