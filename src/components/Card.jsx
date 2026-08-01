import clsx from 'clsx';

/* ─── Card ───────────────────────────────────────────────────────────── */
const variants = {
    glass: 'glass',
    elevated:
        'bg-[var(--bg-elevated)] border border-[var(--border-color)] shadow-[0_4px_24px_rgba(0,0,0,0.25)]',
    flat:
        'bg-[var(--bg-surface)] border border-[var(--border-color)]',
    gradient:
        'bg-gradient-to-br from-brand-600/20 via-accent-600/15 to-transparent ' +
        'border border-brand-500/20',
};

export function Card({
    children,
    variant = 'glass',
    className,
    hover = false,
    padding = 'md',
    onClick,
    ...props
}) {
    const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

    return (
        <div
            className={clsx(
                'rounded-[var(--radius-card)] transition-all duration-200',
                variants[variant],
                paddings[padding],
                hover && 'hover:scale-[1.01] hover:shadow-[0_0_24px_rgba(99,102,241,0.25)] cursor-pointer',
                onClick && 'cursor-pointer',
                className,
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}

/* ─── Card sub-components ────────────────────────────────────────────── */
export function CardHeader({ children, className, ...props }) {
    return (
        <div
            className={clsx(
                'flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-color)]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardTitle({ children, className, ...props }) {
    return (
        <h3
            className={clsx('text-base font-semibold text-[var(--text-primary)]', className)}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardBody({ children, className, ...props }) {
    return (
        <div className={clsx('text-[var(--text-secondary)] text-sm leading-relaxed', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className, ...props }) {
    return (
        <div
            className={clsx(
                'flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
