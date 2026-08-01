import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext(null);

let toastCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
        clearTimeout(timersRef.current[id]);
    }, []);

    const toast = useCallback(({ message = '', variant = 'info', duration = 4000, title }) => {
        const id = ++toastCounter;
        setToasts(prev => [...prev, { id, message, variant, title, exiting: false }]);
        if (duration > 0) {
            timersRef.current[id] = setTimeout(() => dismiss(id), duration);
        }
        return id;
    }, [dismiss]);

    useEffect(() => {
        const timers = timersRef.current;
        return () => Object.values(timers).forEach(clearTimeout);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <ToastContainer toasts={toasts} dismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be inside <ToastProvider>');
    return ctx;
}

/* ─── Internal Toast Container ──────────────────────────────────────── */
function ToastContainer({ toasts, dismiss }) {
    return (
        <div
            role="log"
            aria-live="polite"
            aria-label="Notifications"
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                pointerEvents: 'none',
            }}
        >
            {toasts.map(t => (
                <ToastItem key={t.id} toast={t} dismiss={dismiss} />
            ))}
        </div>
    );
}

const variantStyles = {
    info: { accent: '#38bdf8', icon: '💡' },
    success: { accent: '#22c55e', icon: '✅' },
    warning: { accent: '#f59e0b', icon: '⚠️' },
    error: { accent: '#ef4444', icon: '❌' },
};

function ToastItem({ toast, dismiss }) {
    const { accent, icon } = variantStyles[toast.variant] ?? variantStyles.info;

    return (
        <div
            role="alert"
            aria-atomic="true"
            style={{
                pointerEvents: 'all',
                minWidth: '300px',
                maxWidth: '380px',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                background: 'rgba(15, 23, 42, 0.88)',
                border: `1px solid ${accent}55`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: '0.875rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                animation: toast.exiting
                    ? 'slideInRight 0.3s ease reverse forwards'
                    : 'slideInRight 0.3s ease forwards',
                transition: 'opacity 0.3s ease',
                opacity: toast.exiting ? 0 : 1,
            }}
        >
            <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>{icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#f1f5f9', marginBottom: '0.2rem' }}>
                        {toast.title}
                    </p>
                )}
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {toast.message}
                </p>
            </div>
            <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '1rem',
                    lineHeight: 1,
                    padding: '0.1rem',
                    flexShrink: 0,
                    transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
                ×
            </button>
        </div>
    );
}
