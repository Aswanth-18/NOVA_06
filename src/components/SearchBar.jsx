import { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

export default function SearchBar({
    placeholder = 'Search…',
    value,
    onChange,
    onClear,
    onSubmit,
    size = 'md',
    className,
    id = 'searchbar',
    autoFocus,
    ...props
}) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const heights = { sm: 'h-8 text-sm', md: 'h-10 text-sm', lg: 'h-12 text-base' };

    const handleClear = () => {
        onClear?.();
        onChange?.({ target: { value: '' } });
        inputRef.current?.focus();
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') onSubmit?.(e.currentTarget.value);
        if (e.key === 'Escape') handleClear();
    };

    return (
        <div
            role="search"
            className={clsx(
                'relative flex items-center rounded-[var(--radius-input)] transition-all duration-200',
                'bg-[var(--bg-elevated)] border',
                focused
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : 'border-[var(--border-color)]',
                className,
            )}
        >
            <label htmlFor={id} className="sr-only">Search</label>
            <Search
                size={16}
                aria-hidden="true"
                className={clsx(
                    'absolute left-3 flex-shrink-0 transition-colors duration-200 pointer-events-none',
                    focused ? 'text-brand-400' : 'text-[var(--text-muted)]',
                )}
            />
            <input
                ref={inputRef}
                id={id}
                type="search"
                autoComplete="off"
                autoFocus={autoFocus}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={clsx(
                    'w-full bg-transparent pl-9 pr-8 outline-none',
                    'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                    heights[size],
                )}
                {...props}
            />
            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={handleClear}
                    className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
