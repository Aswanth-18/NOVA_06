import clsx from 'clsx';

/* ─── Variant definitions ────────────────────────────────────────────── */
const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] ' +
    'transition-all duration-200 cursor-pointer select-none focus-visible:outline ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

const variants = {
    primary:
        'gradient-brand text-white shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] ' +
        'hover:brightness-110',
    secondary:
        'bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 ' +
        'hover:border-brand-500/60',
    ghost:
        'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]',
    danger:
        'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-400',
    success:
        'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:border-green-400',
    outline:
        'border border-[var(--border-color)] text-[var(--text-primary)] ' +
        'hover:border-brand-500/50 hover:bg-brand-500/5',
};

const sizes = {
    xs: 'h-7 px-2.5 text-xs',
    sm: 'h-8 px-3.5 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg',
    icon: 'h-10 w-10 p-0',
};

/* ─── Spinner ────────────────────────────────────────────────────────── */
function Spinner() {
    return (
        <span
            aria-hidden="true"
            style={{
                width: '1em',
                height: '1em',
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
                flexShrink: 0,
            }}
        />
    );
}

/* ─── Button ─────────────────────────────────────────────────────────── */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    as: Tag = 'button',
    ...props
}) {
    return (
        <Tag
            className={clsx(
                base,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                loading && 'pointer-events-none',
                className,
            )}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading ? <Spinner /> : leftIcon}
            {children}
            {!loading && rightIcon}
        </Tag>
    );
}
