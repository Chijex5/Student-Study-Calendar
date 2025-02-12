import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSavedSchedules, SavedSchedule } from '../utils/scheduleStorage';

const ConfirmModal = ({ 
    title,
    message,
    onConfirm,
    onCancel
  }: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-[#1A0830] to-[#2D0A54] border border-white/20 rounded-xl p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-[#E0B0FF] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[#E040FB]/20 hover:bg-[#E040FB]/30 text-[#E040FB] transition-all"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

const DataManagementPage: React.FC = () => {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingImport, setPendingImport] = useState<string | null>(null);

  const handleExport = () => {
    const schedules = getSavedSchedules();
    const dataStr = JSON.stringify(schedules, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chronos-backup-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
          const jsonData = event.target?.result;
          if (typeof jsonData !== 'string') throw new Error('Invalid file content');
          
          setPendingImport(jsonData);
          setShowConfirmModal(true);
          
        } catch (error) {
          setImportError('Invalid file format - must be Chronos backup');
        }
      };
    reader.readAsText(file);
  };
  const handleImportConfirm = () => {
    if (pendingImport) {
      try {
        localStorage.setItem('schedules', pendingImport);
        setImportSuccess('Reality overwritten successfully');
        setShowConfirmModal(false);
        setPendingImport(null);
      } catch (error) {
        setImportError('Temporal paradox detected - import failed');
      }
    }
  };

  const handleImportCancel = () => {
    setImportError('Quantum flux stabilized - import aborted');
    setShowConfirmModal(false);
    setPendingImport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0830] to-[#2D0A54] p-8">
        <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal
            title="Temporal Overwrite Confirmation"
            message="This action will rewrite your current timeline. Are you certain you want to proceed?"
            onConfirm={handleImportConfirm}
            onCancel={handleImportCancel}
          />
        )}
      </AnimatePresence>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E040FB] to-[#26A69A] bg-clip-text text-transparent">
          Data Vault
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Export Card */}
          <div className="backdrop-blur-[10px] bg-white/5 border border-white/20 rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#E040FB]/20 rounded-full">
                <Download className="text-[#E040FB]" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Export Knowledge</h2>
            </div>
            <p className="text-[#E0B0FF] mb-6">
              Preserve your timelines in crystalline JSON format
            </p>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-[#E040FB]/20 hover:bg-[#E040FB]/30 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <Download size={18} />
              Download Chrono-Archive
            </button>
          </div>

          {/* Import Card */}
          <div className="backdrop-blur-[10px] bg-white/5 border border-white/20 rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#26A69A]/20 rounded-full">
                <Upload className="text-[#26A69A]" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Import Legacy</h2>
            </div>
            <p className="text-[#E0B0FF] mb-6">
              Restore timelines from previous iterations
            </p>
            <label className="w-full flex items-center justify-center gap-2 bg-[#26A69A]/20 hover:bg-[#26A69A]/30 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer">
              <Upload size={18} />
              Upload Chrono-Archive
              <input
                type="file"
                accept="application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Status Messages */}
        {(importError || importSuccess) && (
          <div className={`backdrop-blur-[10px] p-4 rounded-lg ${
            importError ? 
            'bg-[#FF5252]/20 border border-[#FF5252]/30' : 
            'bg-[#26A69A]/20 border border-[#26A69A]/30'
          }`}>
            <p className={`font-medium ${
              importError ? 'text-[#FF5252]' : 'text-[#26A69A]'
            }`}>
              {importError || importSuccess}
            </p>
          </div>
        )}

        {/* Data Disclaimer */}
        <p className="text-[#E0B0FF]/60 text-sm text-center mt-12">
          All temporal data is encrypted locally using chrono-shards before storage
        </p>
      </div>
    </div>
  );
};

export default DataManagementPage;