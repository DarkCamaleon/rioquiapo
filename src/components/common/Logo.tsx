
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`inline-flex flex-col items-center bg-primary px-3 py-1 text-white ${className}`}>
      <span className="font-script text-3xl leading-none">Rio Quiapo</span>
      <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] leading-none mt-0.5">
        Inmobiliaria
      </span>
    </div>
  );
};

export default Logo;
