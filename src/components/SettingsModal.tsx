import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences } from '../types';
import {
  X,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Keyboard,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onExport: () => void;
  onImport: (jsonString: string) => { success: boolean; message: string };
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  preferences,
  onUpdatePreferences,
  onExport,
  onImport,
  onResetData,
  onClose,
}) => {
  const [importStatus, setImportStatus] = useState<{ message: string; success: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = onImport(content);
      setImportStatus({
        success: result.success,
        message: result.message,
      });
      // Clear file input so same file can be re-selected if desired
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold">Settings & Preferences</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your TASKFLOW environment
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Theme & Appearance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ ...preferences, theme: 'dark' })}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Dark Mode</div>
                  <div className="text-[11px] text-slate-500">Deep charcoal (Default)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onUpdatePreferences({ ...preferences, theme: 'light' })}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  preferences.theme === 'light'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Light Mode</div>
                  <div className="text-[11px] text-slate-500">Crisp slate white</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sound & Feedback */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Interaction Feedback
            </h3>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {preferences.soundEffects ? (
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <div className="text-xs font-medium">Celebration Animations & Effects</div>
                  <div className="text-[11px] text-slate-500">
                    Confetti bursts upon completing tasks
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdatePreferences({ ...preferences, soundEffects: !preferences.soundEffects })
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  preferences.soundEffects ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.soundEffects ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Backup & Data Management
            </h3>

            {importStatus && (
              <div
                className={`mb-3 p-3 rounded-xl text-xs border flex items-center gap-2 ${
                  importStatus.success
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {importStatus.success ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onExport}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-medium transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-medium cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Import JSON Backup</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Clear / Reset Data */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset all data to default template
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="text-xs text-rose-400 font-medium">
                    Are you sure? This will clear custom tasks and reset to clean defaults.
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetData();
                        setShowResetConfirm(false);
                        onClose();
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
                    >
                      Yes, reset all
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div>
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              <Keyboard className="w-3.5 h-3.5" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between items-center py-1">
                <span>Quick Add / Search Task</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[10px]">
                  Ctrl/Cmd + K
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Close Modals / Cancel</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[10px]">
                  Esc
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Save Task from Quick-Add</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[10px]">
                  Enter ↵
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
