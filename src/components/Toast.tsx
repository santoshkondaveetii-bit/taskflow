import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, XCircle, X, RotateCcw } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-slate-900/95 text-slate-100 border-emerald-500/40 shadow-emerald-500/10'
                : isError
                ? 'bg-slate-900/95 text-slate-100 border-rose-500/40 shadow-rose-500/10'
                : isWarning
                ? 'bg-slate-900/95 text-slate-100 border-amber-500/40 shadow-amber-500/10'
                : 'bg-slate-900/95 text-slate-100 border-indigo-500/40 shadow-indigo-500/10'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isError && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
              <span className="text-sm font-medium leading-snug truncate">{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss(toast.id);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
