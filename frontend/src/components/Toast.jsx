import './Toast.css';

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
          onClick={() => onRemove(toast.id)}
        >
          <div className="toast-icon">
            {toast.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 2l8 14H2L10 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            )}
          </div>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={(e) => { e.stopPropagation(); onRemove(toast.id); }}>×</button>
        </div>
      ))}
    </div>
  );
}
