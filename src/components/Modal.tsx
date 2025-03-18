import React, { useEffect, useRef, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: string;
  className?: string;
  children: ReactNode;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  maxWidth = 'max-w-md',
  className = '', 
  children 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Close on click outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-[30px] shadow-lg animate-scale-in ${maxWidth} ${className}`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '95vw' }}
      >
        {title && (
          <div className="flex justify-between items-center border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
        
        <div className={title ? "p-4" : "p-4"}>
          {children}
        </div>
      </div>
    </div>
  );
} 