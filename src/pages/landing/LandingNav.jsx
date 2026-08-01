import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from '../../context/RouterContext';

const NAV_LINKS = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Leaderboard', href: '#leaderboard' },
    { label: 'About', href: '#about' },
];

export default function LandingNav() {
    const { isDark, toggleTheme } = useTheme();
    const { navigate } = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleNav = (href) => {
        setMenuOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            role="banner"
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                transition: 'all 0.3s ease',
            }}
            className={scrolled ? 'landing-nav shadow-lg' : 'landing-nav'}
        >
            <nav
                aria-label="Main navigation"
                style={{
                    maxWidth: '1200px', margin: '0 auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 1.5rem', height: '68px',
                }}
            >
                {/* Logo */}
                <a
                    href="#hero"
                    aria-label="SkillSync home"
                    onClick={e => { e.preventDefault(); handleNav('#hero'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}
                >
                    <span style={{
                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #d946ef 100%)',
                        boxShadow: '0 0 16px rgba(99,102,241,0.55)',
                    }}>
                        <Zap size={18} color="white" />
                    </span>
                    <span style={{
                        fontWeight: 800, fontSize: '1.175rem', letterSpacing: '-0.02em',
                        background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #e879f9 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                        SkillSync
                    </span>
                </a>

                {/* Desktop links */}
                <ul role="list" style={{
                    display: 'none', gap: '0.25rem', listStyle: 'none', margin: 0, padding: 0,
                    ...(typeof window !== 'undefined' && window.innerWidth >= 768 ? { display: 'flex' } : {}),
                }}
                    className="nav-links-desktop"
                >
                    {NAV_LINKS.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={e => { e.preventDefault(); handleNav(link.href); }}
                                style={{
                                    padding: '0.5rem 0.875rem', borderRadius: '8px', fontSize: '0.875rem',
                                    fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none',
                                    transition: 'color 0.2s, background 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Right actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Theme toggle */}
                    <button
                        id="landing-theme-toggle"
                        type="button"
                        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                        onClick={toggleTheme}
                        style={{
                            width: '38px', height: '38px', borderRadius: '10px', border: 'none',
                            background: 'transparent', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-secondary)', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#818cf8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Login (desktop) */}
                    <a
                        href="#login"
                        id="nav-login"
                        onClick={e => { e.preventDefault(); navigate('login'); }}
                        className="nav-login-btn"
                        style={{
                            padding: '0.5rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem',
                            fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                            display: 'none',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.55)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; e.currentTarget.style.filter = 'brightness(1)'; }}
                    >
                        Login
                    </a>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(s => !s)}
                        style={{
                            width: '38px', height: '38px', borderRadius: '10px', border: 'none',
                            background: 'transparent', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-secondary)',
                        }}
                        className="mobile-menu-btn"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div
                    aria-label="Mobile navigation"
                    style={{
                        position: 'absolute', top: '68px', left: 0, right: 0,
                        background: 'rgba(8,14,26,0.97)', borderBottom: '1px solid rgba(99,102,241,0.2)',
                        padding: '1rem 1.5rem',
                        backdropFilter: 'blur(20px)',
                        animation: 'fadeIn 0.2s ease forwards',
                    }}
                >
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={e => { e.preventDefault(); handleNav(link.href); }}
                            style={{
                                display: 'block', padding: '0.75rem 1rem', borderRadius: '10px',
                                color: 'var(--text-secondary)', textDecoration: 'none',
                                fontWeight: 500, fontSize: '0.9375rem', marginBottom: '0.25rem',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(99,102,241,0.15)' }}>
                        <a
                            href="#login"
                            onClick={e => { e.preventDefault(); setMenuOpen(false); navigate('login'); }}
                            style={{
                                display: 'block', textAlign: 'center', padding: '0.75rem',
                                borderRadius: '10px', fontWeight: 600, textDecoration: 'none',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white',
                            }}
                        >
                            Login
                        </a>
                    </div>
                </div>
            )}

            <style>{`
        @media (min-width: 768px) {
          .nav-links-desktop { display: flex !important; }
          .nav-login-btn     { display: inline-flex !important; }
          .mobile-menu-btn   { display: none !important; }
        }
      `}</style>
        </header>
    );
}
