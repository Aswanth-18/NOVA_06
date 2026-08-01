import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import Button from './Button';

const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
};

export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    closeOnOverlay = true,
    showCloseButton = true,
    className,
    id = 'modal',
}) {
    const dialogRef = useRef(null);
    const prevFocusRef = useRef(null);

    // Lock scroll and trap focus
    useEffect(() => {
        if (!open) return;

        prevFocusRef.current = document.activeElement;
        document.body.style.overflow = 'hidden';

        // Focus first focusable element
        const timer = setTimeout(() => {
            const el = dialogRef.current?.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            el?.focus();
        }, 50);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
            prevFocusRef.current?.focus();
        };
    }, [open]);

    const handleKeyDown = useCallback(e => {
        if (e.key === 'Escape') onClose?.();

        // Focus trap
        if (e.key === 'Tab' && dialogRef.current) {
            const focusable = dialogRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first?.focus();
            }
        }
    }, [onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={description ? `${id}-desc` : undefined}
            onKeyDown={handleKeyDown}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
            {/* Overlay */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Dialog panel */}
            <div
                ref={dialogRef}
                className={clsx(
                    'relative w-full glass rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)]',
                    'animate-scale-in',
                    sizes[size],
                    className,
                )}
            >
                {/* Gradient top edge */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px rounded-t-2xl gradient-brand opacity-60"
                />

                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div>
                            {title && (
                                <h2
                                    id={`${id}-title`}
                                    className="text-lg font-semibold text-[var(--text-primary)]"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    id={`${id}-desc`}
                                    className="text-sm text-[var(--text-secondary)] mt-1"
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                type="button"
                                aria-label="Close dialog"
                                onClick={onClose}
                                className={clsx(
                                    'flex items-center justify-center w-8 h-8 rounded-lg ml-4 flex-shrink-0',
                                    'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                                    'hover:bg-white/8 transition-all duration-150',
                                )}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className={clsx('px-6', !title && 'pt-6', !footer && 'pb-6')}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-color)]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Convenience exports ─────────────────────────────────────────────── */
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) {
    return (
        <Modal open={open} onClose={onClose} title={title} size="sm"
            footer={
                <>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button variant={variant} size="sm" onClick={() => { onConfirm?.(); onClose?.(); }}>
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-[var(--text-secondary)] py-2">{message}</p>
        </Modal>
    );
}
