import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  description,
  className = "",
  showCloseButton = true,
  size = "default"
}) {
  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl"
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content 
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "bg-white rounded-lg shadow-lg border border-gray-200",
            "w-full max-h-[85vh] overflow-y-auto",
            "animate-in fade-in zoom-in-95 duration-200",
            sizeClasses?.[size],
            className
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-gray-600">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              )}
            </div>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;