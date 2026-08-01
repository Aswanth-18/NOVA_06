import clsx from 'clsx';

/* ─── Badge ──────────────────────────────────────────────────────────── */
const variants = {
    default: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
    primary: 'bg-brand-500/15 text-brand-300 border-brand-500/25',
    success: 'bg-green-500/15  text-green-400  border-green-500/25',
    warning: 'bg-amber-500/15  text-amber-400  border-amber-500/25',
    danger: 'bg-red-500/15   text-red-400    border-red-500/25',
    info: 'bg-sky-500/15   text-sky-400    border-sky-500/25',
    accent: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
};

const sizes = {
    sm: 'text-[0.65rem] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
};

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    className,
    ...props
}) {
    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {dot && (
                <span
                    aria-hidden="true"
                    className={clsx(
                        'rounded-full flex-shrink-0',
                        size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5',
                    )}
                    style={{ background: 'currentColor' }}
                />
            )}
            {children}
        </span>
    );
}
