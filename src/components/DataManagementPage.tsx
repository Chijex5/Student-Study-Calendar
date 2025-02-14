import React, { useState } from 'react';
import { Download, Upload, Lock, Shield, XCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoaderPage from './LoaderPage';
import { getSavedSchedules, SavedSchedule } from '../utils/scheduleStorage';

// A helper function to validate that the imported data matches the expected structure.
// Here, we assume that a valid Chronos backup is an array of schedules, where each schedule is an object 
// with at least an 'id' property. Adjust this logic based on your actual data requirements.
const isValidScheduleData = (data: any): data is SavedSchedule[] => {
  if (!Array.isArray(data)) return false;
  return data.every(item => typeof item === 'object' && item !== null && 'id' in item);
};

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  // Optional preview data to show in the modal.
  previewData?: any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  previewData
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
      <p className="text-[#E0B0FF] mb-4">{message}</p>
      {/* Preview block: show the imported JSON in a scrollable preview area */}
      {previewData && (
        <div className="mt-4 p-2 bg-white/10 rounded overflow-auto max-h-60">
          <pre className="text-xs text-[#E0B0FF]">
            {JSON.stringify(previewData, null, 2)}
          </pre>
        </div>
      )}
      <div className="flex justify-end gap-3 mt-6">
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
  // We'll store the parsed JSON object rather than the raw string.
  const [pendingImport, setPendingImport] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Drag-and-drop handlers remain the same.
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload({ target: { files: [file] } } as any);
  };

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

  // Updated file upload handler:
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const fileContent = event.target?.result;
        if (typeof fileContent !== 'string') throw new Error('Invalid file content');

        // Parse the JSON.
        const parsedData = JSON.parse(fileContent);

        // Validate the data format.
        if (!isValidScheduleData(parsedData)) {
          setImportError('Invalid file format - must be Chronos backup');
          return;
        }

        // If valid, store the parsed data and show the confirm modal with a preview.
        setPendingImport(parsedData);
        setShowConfirmModal(true);
      } catch (error) {
        setImportError('Invalid file format - must be Chronos backup');
      }
    };

    reader.readAsText(file);
  };

  // Updated import confirm handler with a simulated 5-minute delay.
  const handleImportConfirm = () => {
    if (pendingImport) {
      setIsProcessing(true);
      setShowConfirmModal(false);
      new Promise((resolve) => {
        setTimeout(() => resolve(true), 5000); // 300,000 ms = 5 minutes
      })
        .then(() => {
          // After the delay, write to localStorage.
          localStorage.setItem('schedules', JSON.stringify(pendingImport));
          setImportSuccess('Reality overwritten successfully');
          
          setPendingImport(null);
        })
        .catch(() => {
          setImportError('Temporal paradox detected - import failed');
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleImportCancel = () => {
    setImportError('Quantum flux stabilized - import aborted');
    setShowConfirmModal(false);
    setPendingImport(null);
  };

  if(isProcessing) return <LoaderPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0830] to-[#2D0A54] p-8">
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal
            title="Temporal Overwrite Confirmation"
            message="This action will rewrite your current timeline. Are you certain you want to proceed?"
            onConfirm={handleImportConfirm}
            onCancel={handleImportCancel}
            previewData={pendingImport} // Pass the parsed data as preview.
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
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-[#E040FB]/20 hover:bg-[#E040FB]/30 text-white font-medium py-3 rounded-lg transition-colors relative"
            >
              {isProcessing ? (
                <motion.div
                  className="border-2 border-[#E040FB] border-t-transparent rounded-full w-6 h-6"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              ) : (
                <>
                  <Download size={18} />
                  Download Chrono-Archive
                </>
              )}
            </button>
          </div>

          {/* Import Card */}
          <div
            className={`backdrop-blur-[10px] bg-white/5 border-2 ${
              isDragging ? 'border-[#26A69A]' : 'border-white/20'
            } rounded-xl p-6 transition-all duration-300 relative`}
            onDragEnter={handleDrag}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#26A69A]/20 rounded-full relative">
                <Upload className="text-[#26A69A]" size={24} />
                {isDragging && <div className="absolute inset-0 bg-[#26A69A]/10 animate-pulse rounded-full" />}
              </div>
              <h2 className="text-xl font-bold text-white">Import Legacy</h2>
            </div>
            <p className="text-[#E0B0FF] mb-6">
              Restore timelines from previous iterations or drag file here
            </p>
            <label className="w-full flex items-center justify-center gap-2 bg-[#26A69A]/20 hover:bg-[#26A69A]/30 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer relative">
              <Upload size={18} />
              Upload Chrono-Archive
              <input type="file" accept="application/json" onChange={handleFileUpload} className="hidden" />
              {isProcessing && (
                <div className="absolute inset-0 bg-[#26A69A]/10 flex items-center justify-center">
                  <motion.div
                    className="border-2 border-[#26A69A] border-t-transparent rounded-full w-6 h-6"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Status Messages */}
        {(importError || importSuccess) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`backdrop-blur-[10px] p-4 rounded-lg flex items-center gap-3 ${
              importError ? 'bg-[#FF5252]/20 border border-[#FF5252]/30' : 'bg-[#26A69A]/20 border border-[#26A69A]/30'
            }`}
          >
            {importError ? <XCircle className="text-[#FF5252]" size={20} /> : <CheckCircle2 className="text-[#26A69A]" size={20} />}
            <p className={`font-medium ${importError ? 'text-[#FF5252]' : 'text-[#26A69A]'}`}>
              {importError || importSuccess}
            </p>
          </motion.div>
        )}

        {/* Data Disclaimer */}
        <div className="flex items-center justify-center gap-2 text-[#E0B0FF]/60 text-sm text-center mt-12">
          <Lock className="w-4 h-4" />
          <span>All temporal data encrypted with AES-256 chrono-shards</span>
          <Shield className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;