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
          className={`${fill ? 'object-contain' : 'w-full h-auto block'}`}
          draggable={false}
          sizes={sizes}
        />

        {/* Watermark Layer - Strictly bound to the image above */}
        {showWatermark && (
          <div className="absolute bottom-[8%] left-0 right-0 flex justify-center z-10 pointer-events-none">
            <div 
              className="relative w-[50%] max-w-[240px] opacity-[0.45] drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
              style={{ 
                mixBlendMode: 'screen',
                filter: 'brightness(1.1) contrast(1.1)'
              }}
            >
              <Image
                src="/images/watermarks/svg/logo-1.svg"
                alt="Watermark"
                width={240}
                height={240}
                className="w-full h-auto"
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
