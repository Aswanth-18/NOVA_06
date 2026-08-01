import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

const sizes = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-sm px-4',
    lg: 'h-12 text-base px-4',
};

const Input = forwardRef(function Input(
    {
        label,
        hint,
        error,
        size = 'md',
        leftIcon,
        rightIcon,
        type = 'text',
        fullWidth = true,
        className,
        id,
        required,
        ...props
    },
    ref,
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                >
                    {label}
                    {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
                </label>
            )}

            <div className="relative flex items-center">
                {leftIcon && (
                    <span className="absolute left-3 text-[var(--text-muted)] flex items-center pointer-events-none" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    type={inputType}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    className={clsx(
                        'w-full rounded-[var(--radius-input)] border outline-none',
                        'bg-[var(--bg-elevated)] text-[var(--text-primary)]',
                        'placeholder:text-[var(--text-muted)]',
                        'transition-all duration-200',
                        'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
                        error
                            ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-[var(--border-color)]',
                        sizes[size],
                        leftIcon && 'pl-10',
                        (rightIcon || isPassword) && 'pr-10',
                        className,
                    )}
                    {...props}
                />

                {isPassword ? (
                    <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                ) : rightIcon ? (
                    <span className="absolute right-3 text-[var(--text-muted)] flex items-center pointer-events-none" aria-hidden="true">
                        {rightIcon}
                    </span>
                ) : null}
            </div>

            {error && (
                <p id={`${inputId}-error`} role="alert" className="text-xs text-red-400 flex items-center gap-1">
                    <span aria-hidden="true">⚠</span> {error}
                </p>
            )}
            {hint && !error && (
                <p id={`${inputId}-hint`} className="text-xs text-[var(--text-muted)]">
                    {hint}
                </p>
            )}
        </div>
    );
});

export default Input;
