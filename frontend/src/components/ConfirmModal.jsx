import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          >
            <div className="card mx-4">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-dark-text">{title || 'Are you sure?'}</h3>
                  <p className="text-sm text-dark-muted mt-1">
                    {message || 'This action cannot be undone.'}
                  </p>
                </div>
                <button onClick={onCancel} className="text-dark-muted hover:text-dark-text transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button onClick={onCancel} className="btn-secondary" id="modal-cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl
                             transition-all duration-200 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  id="modal-confirm-btn"
                >
                  {loading ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
