'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProfileAvatarProps {
  src: string;
  alt: string;
  size: number;
  className?: string;
}

export default function ProfileAvatar({ src, alt, size, className = '' }: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false)
  
  // Handle image loading error
  const handleError = () => {
    setImgError(true)
  }
  
  // If there's an error loading the image, show a fallback avatar
  if (imgError) {
    return (
      <div 
        className={`rounded-full flex items-center justify-center bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white font-semibold ${className}`}
        style={{ width: size, height: size }}
      >
        {alt.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
      </div>
    )
  }
  
  // Otherwise, show the image
  return (
    <div className={`rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <Image 
        src={src} 
        alt={alt}
        width={size}
        height={size}
        className="object-cover w-full h-full"
        onError={handleError}
        priority
      />
    </div>
  )
} 