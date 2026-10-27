import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#c4b5fd] text-[#2e1065] shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 max-w-sm"
    >
      {toast.type === 'error' ? (
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
      )}
      <span className="text-xs sm:text-sm font-semibold">{toast.text}</span>
      <button
        onClick={onClose}
        className="text-[#9ca3af] hover:text-[#2e1065] p-1 rounded-md transition-colors ml-auto cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
