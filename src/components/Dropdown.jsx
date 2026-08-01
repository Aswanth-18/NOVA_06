import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';

export default function Dropdown({
    trigger,
    items = [],
    value,
    onChange,
    placeholder = 'Select…',
    label,
    align = 'left',
    width = 'w-52',
    className,
    id,
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const dropdownId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'dropdown';
    const listboxId = `${dropdownId}-listbox`;

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = e => {
            if (!containerRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Keyboard navigation
    const handleKeyDown = e => {
        if (e.key === 'Escape') { setOpen(false); return; }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(s => !s); }
        if (e.key === 'ArrowDown' && open) {
            e.preventDefault();
            const idx = items.findIndex(i => i.value === value);
            const next = items[(idx + 1) % items.length];
            if (next) { onChange?.(next.value); }
        }
        if (e.key === 'ArrowUp' && open) {
            e.preventDefault();
            const idx = items.findIndex(i => i.value === value);
            const prev = items[(idx - 1 + items.length) % items.length];
            if (prev) { onChange?.(prev.value); }
        }
    };

    const selected = items.find(i => i.value === value);

    return (
        <div ref={containerRef} className={clsx('relative', className)}>
            {label && (
                <label
                    htmlFor={dropdownId}
                    className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5"
                >
                    {label}
                </label>
            )}

            {/* Trigger (custom or default button) */}
            {trigger ? (
                <div onClick={() => !disabled && setOpen(s => !s)}>
                    {trigger}
                </div>
            ) : (
                <button
                    id={dropdownId}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    aria-label={label ?? 'Dropdown'}
                    disabled={disabled}
                    onClick={() => setOpen(s => !s)}
                    onKeyDown={handleKeyDown}
                    className={clsx(
                        'flex items-center justify-between gap-2 h-10 px-4 w-full',
                        'rounded-[var(--radius-input)] border bg-[var(--bg-elevated)]',
                        'text-sm text-left transition-all duration-200',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        open
                            ? 'border-brand-500 ring-2 ring-brand-500/20 text-[var(--text-primary)]'
                            : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-brand-500/40',
                    )}
                >
                    <span className={clsx(!selected && 'text-[var(--text-muted)]')}>
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className={clsx('flex-shrink-0 transition-transform duration-200', open && 'rotate-180')}
                    />
                </button>
            )}

            {/* Dropdown panel */}
            {open && (
                <div
                    role="listbox"
                    id={listboxId}
                    aria-label={label ?? 'Options'}
                    className={clsx(
                        'absolute z-50 mt-1.5 py-1.5 rounded-xl glass shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                        'animate-scale-in origin-top',
                        width,
                        align === 'right' ? 'right-0' : 'left-0',
                    )}
                >
                    {items.map((item, i) => (
                        <button
                            key={item.value ?? i}
                            role="option"
                            aria-selected={item.value === value}
                            disabled={item.disabled}
                            onClick={() => { onChange?.(item.value, item); setOpen(false); }}
                            className={clsx(
                                'flex items-center justify-between w-full px-3.5 py-2.5 text-sm',
                                'transition-colors duration-150 text-left gap-2',
                                item.disabled && 'opacity-40 cursor-not-allowed',
                                item.value === value
                                    ? 'text-brand-300 bg-brand-500/10'
                                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]',
                                item.danger && 'text-red-400 hover:bg-red-500/10',
                            )}
                        >
                            <span className="flex items-center gap-2.5">
                                {item.icon && <span aria-hidden="true" className="flex-shrink-0">{item.icon}</span>}
                                {item.label}
                            </span>
                            {item.value === value && <Check size={14} aria-hidden="true" />}
                        </button>
                    ))}

                    {items.length === 0 && (
                        <p className="px-3.5 py-2 text-sm text-[var(--text-muted)] text-center">No options</p>
                    )}
                </div>
            )}
        </div>
    );
}
