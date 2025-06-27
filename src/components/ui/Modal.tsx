import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose} 
        />
        <div
          className={cn(
            'relative bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all',
            'animate-fade-in',
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.Header = function ModalHeader({
  children,
  onClose,
  className
}: {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-slate-200',
        className
      )}
    >
      <div className="text-lg font-medium text-slate-900">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-500 transition-colors p-1 hover:bg-slate-100 rounded-md"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('p-6 max-h-[calc(100vh-16rem)] overflow-y-auto', className)}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-slate-50 border-t border-slate-200',
        className
      )}
    >
      {children}
    </div>
  );
};