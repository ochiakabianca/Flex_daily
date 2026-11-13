import { useState } from 'react';
import { Wind } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({ src, alt, className = '', fallbackTitle }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EAF1EF] via-[#F1F5F7] to-[#E2E9EC] text-[#1B4D3E] p-6 text-center ${className}`}
      >
        <Wind className="w-8 h-8 mb-2 opacity-70" strokeWidth={1.5} />
        <span className="font-display text-sm font-medium text-[#111827] max-w-[20ch]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
