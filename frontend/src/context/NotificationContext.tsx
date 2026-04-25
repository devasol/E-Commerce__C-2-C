import React, { createContext, useContext, useState, useCallback } from 'react';
import StatusModal, { ModalType } from '../components/StatusModal';

interface NotificationContextType {
  showModal: (title: string, message: string, type: ModalType) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = useCallback((title: string, message: string, type: ModalType) => {
    setModal({ isOpen: true, title, message, type });
  }, []);

  const showSuccess = useCallback((message: string, title: string = 'Success!') => {
    showModal(title, message, 'success');
  }, [showModal]);

  const showError = useCallback((message: string, title: string = 'Oops!') => {
    showModal(title, message, 'error');
  }, [showModal]);

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showModal, showSuccess, showError }}>
      {children}
      <StatusModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </NotificationContext.Provider>
  );
};
