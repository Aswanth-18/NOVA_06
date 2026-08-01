import clsx from 'clsx';

/* ─── Skeleton Base ──────────────────────────────────────────────────── */
export function Skeleton({ className, width, height, rounded = 'md', ...props }) {
    const radii = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        full: 'rounded-full',
    };

    return (
        <span
            aria-hidden="true"
            className={clsx('block skeleton-shimmer', radii[rounded], className)}
            style={{ width, height }}
            {...props}
        />
    );
}

/* ─── Text lines ─────────────────────────────────────────────────────── */
export function SkeletonText({ lines = 3, className }) {
    return (
        <div className={clsx('flex flex-col gap-2', className)} aria-hidden="true">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="0.875rem"
                    rounded="md"
                    className={i === lines - 1 ? 'w-3/4' : 'w-full'}
                />
            ))}
        </div>
    );
}

/* ─── Card Skeleton ──────────────────────────────────────────────────── */
export function SkeletonCard({ className }) {
    return (
        <div
            aria-busy="true"
            aria-label="Loading content"
            className={clsx(
                'rounded-[var(--radius-card)] border border-[var(--border-color)] p-6 flex flex-col gap-4',
                'bg-[var(--bg-elevated)]',
                className,
            )}
        >
            <div className="flex items-center gap-3">
                <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
                <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton height="0.875rem" className="w-1/2" />
                    <Skeleton height="0.75rem" className="w-1/3" />
                </div>
            </div>
            <SkeletonText lines={3} />
            <div className="flex justify-between items-center mt-1">
                <Skeleton width="5rem" height="1.75rem" rounded="full" />
                <Skeleton width="4rem" height="2rem" rounded="lg" />
            </div>
        </div>
    );
}

/* ─── Table Row Skeleton ─────────────────────────────────────────────── */
export function SkeletonTableRow({ cols = 4, className }) {
    return (
        <div
            aria-hidden="true"
            className={clsx('flex items-center gap-4 py-3 px-4', className)}
        >
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="0.875rem"
                    className={i === 0 ? 'w-1/4' : 'flex-1'}
                />
            ))}
        </div>
    );
}

/* ─── Avatar + Name Skeleton ─────────────────────────────────────────── */
export function SkeletonAvatar({ size = '2.5rem', showName = true, className }) {
    return (
        <div className={clsx('flex items-center gap-3', className)} aria-hidden="true">
            <Skeleton width={size} height={size} rounded="full" />
            {showName && (
                <div className="flex flex-col gap-1.5">
                    <Skeleton height="0.875rem" className="w-24" />
                    <Skeleton height="0.75rem" className="w-16" />
                </div>
            )}
        </div>
    );
}

/* ─── Grid of Card Skeletons ─────────────────────────────────────────── */
export function SkeletonGrid({ count = 6, columns = 3, className }) {
    return (
        <div
            aria-label="Loading content"
            aria-busy="true"
            className={clsx(
                'grid gap-4',
                columns === 2 && 'grid-cols-1 sm:grid-cols-2',
                columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
                className,
            )}
        >
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
