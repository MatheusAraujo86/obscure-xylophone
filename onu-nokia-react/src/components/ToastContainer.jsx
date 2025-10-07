import { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <FiCheckCircle className="toast-icon" />;
    case 'error':
      return <FiXCircle className="toast-icon" />;
    case 'warning':
      return <FiAlertTriangle className="toast-icon" />;
    case 'info':
    default:
      return <FiInfo className="toast-icon" />;
  }
};

const Toast = ({ toast, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  return (
    <div 
      className={`toast toast-${toast.type} ${isRemoving ? 'removing' : ''}`}
      onClick={handleRemove}
    >
      <ToastIcon type={toast.type} />
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={handleRemove}>
        <FiX />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
