'use client'

import LoginForm from '@/components/LoginForm'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen bg-dark relative overflow-hidden">
      {/* Background grid lines */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid grid-cols-6 lg:grid-cols-12 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`col-${i}`} className={`border-r border-white/12 h-full ${i >= 6 ? 'hidden lg:block' : ''}`}></div>
          ))}
        </div>
        <div className="grid grid-rows-6 lg:grid-rows-12 w-full absolute top-0 left-0 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`row-${i}`} className={`border-b border-white/12 w-full ${i >= 6 ? 'hidden lg:block' : ''}`}></div>
          ))}
        </div>
      </div>
      
      {/* Background blur elements - matching Figma specs */}
      <div className="absolute w-[418px] h-[633px] top-[-404px] right-[452px] rounded-full bg-primary/80 blur-[287px] lg:block hidden"></div>
      <div className="absolute w-[418px] h-[633px] bottom-[-400px] left-[-271px] rounded-full bg-primary/80 blur-[324px] lg:block hidden"></div>
      
      {/* Mobile background blur elements */}
      <div className="absolute w-[300px] h-[300px] top-[-150px] right-[-150px] rounded-full bg-primary/50 blur-[150px] lg:hidden block"></div>
      <div className="absolute w-[300px] h-[300px] bottom-[-150px] left-[-150px] rounded-full bg-[#4D4D4D]/50 blur-[150px] lg:hidden block"></div>
      
      {/* Left side - Login container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center z-10 relative">
        <div className="w-full lg:w-[562.5px] px-[30px] lg:px-[50px] py-[40px] lg:ml-[76px] lg:mt-[90px] max-w-[100%] lg:max-w-none backdrop-blur-sm bg-black/30 rounded-3xl border border-white/10 shadow-xl">
          <LoginForm />
        </div>
      </div>
      
      {/* Right side - Background image - only visible on desktop */}
      <div className="hidden lg:block w-1/2 relative">
        <Image 
          src="/images/background-image.png" 
          alt="Fitness background" 
          fill 
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>
      
      {/* Global styles for text enhancement */}
      <style jsx global>{`
        h1, h2, p, label, span, div {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </main>
  )
} 