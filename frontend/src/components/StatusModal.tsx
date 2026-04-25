import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

export type ModalType = 'success' | 'error' | 'info' | 'warning';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: ModalType;
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, title, message, type }) => {
  const getColors = () => {
    switch (type) {
      case 'success': return { icon: <FaCheckCircle className="text-emerald-500" />, shadow: 'shadow-emerald-500/20', border: 'border-emerald-500/20', bg: 'bg-emerald-500' };
      case 'error': return { icon: <FaTimesCircle className="text-rose-500" />, shadow: 'shadow-rose-500/20', border: 'border-rose-500/20', bg: 'bg-rose-500' };
      case 'warning': return { icon: <FaExclamationTriangle className="text-amber-500" />, shadow: 'shadow-amber-500/20', border: 'border-amber-500/20', bg: 'bg-amber-500' };
      default: return { icon: <FaInfoCircle className="text-blue-500" />, shadow: 'shadow-blue-500/20', border: 'border-blue-500/20', bg: 'bg-blue-500' };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[9998]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full max-w-sm pointer-events-auto bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 text-center shadow-2xl ${colors.shadow} border ${colors.border} relative overflow-hidden`}
            >
              {/* Animated Background Element */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${colors.bg}`} />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-6xl flex justify-center mb-6"
              >
                {colors.icon}
              </motion.div>

              <h2 className="text-2xl font-display font-black text-surface-900 mb-3 tracking-tight">
                {title}
              </h2>
              
              <p className="text-surface-600 font-medium leading-relaxed mb-8">
                {message}
              </p>

              <button
                onClick={onClose}
                className={`w-full py-4 rounded-2xl text-white font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${colors.bg} hover:shadow-xl hover:brightness-110`}
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;
