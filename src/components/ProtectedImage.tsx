'use client';

import React from 'react';
import Image from 'next/image';

interface ProtectedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  showWatermark?: boolean;
  sizes?: string; // Added sizes prop for performance optimization
}

/**
 * ProtectedImage Component
 * 
 * Architecture: Zero-Layout-Shift Protocol
 * - Uses natural aspect ratio (w-full h-auto)
 * - No fill, object-cover, or aspect-square properties
 * - Watermark: Logo-1 (SVG) at bottom-center (Optional)
 * - Protection: Prevents drag and right-click
 * 
 * Update: Enhanced Visibility & Proportional Sizing
 * - Watermark is strictly bound to the IMAGE pixels.
 * - Positioned at bottom-[8%] of the actual image height.
 * - Width: Increased to 50% of the image width for better presence.
 * - Max Width: Increased to 240px for a more luxurious feel on larger screens.
 * - Uses mix-blend-mode: screen with 45% opacity for a high-end integrated look.
 */
const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  showWatermark = false,
  sizes,
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className={`relative select-none ${fill ? 'w-full h-full' : 'inline-block'} ${className}`}
      onContextMenu={handleContextMenu}
    >
      {/* 
        Image Wrapper: 
        This div ensures the watermark is relative to the actual rendered image dimensions.
      */}
      <div className={`relative ${fill ? 'w-full h-full' : 'w-auto h-auto'}`}>
        {/* Main Image */}
        <Image
          src={src}
          alt={alt}
          width={!fill ? (width || 800) : undefined}
          height={!fill ? (height || 600) : undefined}
          fill={fill}
          priority={priority}
          // احترم object-fit الممرّر عبر className (لو موجود)؛ وإلا افتراضي cover في وضع fill
          className={`${fill ? (/(object-(cover|contain|fill))/.test(className) ? '' : 'object-cover') : 'w-full h-auto block'}`}
          draggable={false}
          sizes={sizes}
        />

        {/* علامة مائية أنيقة وصغيرة في الزاوية (لا تغطي الموضوع) — حماية بلا إفساد الصورة */}
        {showWatermark && (
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <div
              className="relative w-[64px] sm:w-[76px] opacity-[0.55] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
              style={{ mixBlendMode: 'screen' }}
            >
              <Image
                src="/images/watermarks/svg/logo-1.svg"
                alt=""
                width={80}
                height={80}
                className="w-full h-auto"
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* Protection Overlay - Directly over the image and watermark */}
        <div 
          className="absolute inset-0 z-20 pointer-events-auto bg-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ProtectedImage;
