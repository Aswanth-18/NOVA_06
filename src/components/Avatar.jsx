import clsx from 'clsx';

const sizes = {
    xs: { outer: 'w-6 h-6', text: 'text-[0.6rem]' },
    sm: { outer: 'w-8 h-8', text: 'text-xs' },
    md: { outer: 'w-10 h-10', text: 'text-sm' },
    lg: { outer: 'w-12 h-12', text: 'text-base' },
    xl: { outer: 'w-16 h-16', text: 'text-xl' },
    '2xl': { outer: 'w-20 h-20', text: 'text-2xl' },
};

const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-slate-500',
    busy: 'bg-red-400',
    away: 'bg-amber-400',
};

const statusPositions = {
    xs: 'w-1.5 h-1.5 -bottom-0 -right-0',
    sm: 'w-2 h-2 -bottom-0.5 -right-0.5',
    md: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    lg: 'w-3 h-3 -bottom-0.5 -right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0 right-0',
    '2xl': 'w-4 h-4 bottom-0.5 right-0.5',
};

export default function Avatar({
    src,
    alt = '',
    name,
    size = 'md',
    status,
    square = false,
    className,
    ring = false,
    ...props
}) {
    const { outer, text } = sizes[size] ?? sizes.md;
    const initials = name
        ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
        : '?';

    return (
        <div className={clsx('relative inline-flex flex-shrink-0', outer, className)} {...props}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name || 'User avatar'}
                    className={clsx(
                        'w-full h-full object-cover',
                        square ? 'rounded-lg' : 'rounded-full',
                        ring && 'ring-2 ring-brand-500 ring-offset-2 ring-offset-[var(--bg-base)]',
                    )}
                />
            ) : (
                <span
                    aria-label={alt || name || 'User avatar'}
                    className={clsx(
                        'w-full h-full flex items-center justify-center font-semibold select-none',
                        'gradient-brand text-white',
                        square ? 'rounded-lg' : 'rounded-full',
                        ring && 'ring-2 ring-brand-500 ring-offset-2 ring-offset-[var(--bg-base)]',
                        text,
                    )}
                >
                    {initials}
                </span>
            )}

            {status && (
                <span
                    aria-label={`Status: ${status}`}
                    className={clsx(
                        'absolute rounded-full border-2 border-[var(--bg-base)]',
                        statusColors[status] ?? 'bg-slate-500',
                        statusPositions[size] ?? statusPositions.md,
                    )}
                />
            )}
        </div>
    );
}

/* ─── Avatar Group ───────────────────────────────────────────────────── */
export function AvatarGroup({ avatars = [], max = 4, size = 'sm', className }) {
    const visible = avatars.slice(0, max);
    const extra = avatars.length - max;

    return (
        <div className={clsx('flex -space-x-2', className)} aria-label="Avatar group">
            {visible.map((avatar, i) => (
                <Avatar
                    key={i}
                    size={size}
                    {...avatar}
                    className="ring-2 ring-[var(--bg-base)]"
                />
            ))}
            {extra > 0 && (
                <span
                    aria-label={`${extra} more`}
                    className={clsx(
                        sizes[size]?.outer,
                        'flex items-center justify-center rounded-full',
                        'bg-[var(--bg-elevated)] border border-[var(--border-color)]',
                        'text-xs font-semibold text-[var(--text-secondary)]',
                        'ring-2 ring-[var(--bg-base)]',
                    )}
                >
                    +{extra}
                </span>
            )}
        </div>
    );
}
