import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ 
  content, 
  children, 
  position = 'top',
  delay = 200 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    // Default offset
    const gap = 8;
    
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top + scrollY - gap;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + scrollY + gap;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - gap;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX + gap;
        break;
    }
    
    setCoords({ top, left });
  }, [position]);

  const showTooltip = () => {
    const id = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Recalculate on scroll/resize if visible
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible, calculatePosition]);

  const tooltipElement = isVisible ? (
    <div 
      className="fixed z-[9999] px-2.5 py-1.5 text-xs font-medium text-main bg-surface border border-border rounded-md shadow-xl whitespace-nowrap pointer-events-none animate-fade-in"
      style={{
        top: coords.top,
        left: coords.left,
        transform: `translate(${position === 'left' ? '-100%' : position === 'right' ? '0' : '-50%'}, ${position === 'top' ? '-100%' : position === 'bottom' ? '0' : '-50%'})`
      }}
      role="tooltip"
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <div 
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipElement, document.body)}
    </>
  );
}
