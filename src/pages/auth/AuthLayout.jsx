import { Sun, Moon, Zap, ShieldCheck, Trophy, CalendarCheck, MessageCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from '../../context/RouterContext';

const HIGHLIGHTS = [
    { icon: ShieldCheck, color: '#3B82F6', label: 'Verified Mentors', sub: 'Assessed & trusted by peers' },
    { icon: CalendarCheck, color: '#8B5CF6', label: 'Instant Booking', sub: '1-click session scheduling' },
    { icon: MessageCircle, color: '#a855f7', label: 'Real-Time Chat', sub: 'Stay connected with mentors' },
    { icon: Trophy, color: '#f59e0b', label: 'Earn XP & Badges', sub: 'Climb the leaderboard' },
];

/* ── Decorative SVG illustration ────────────────────────────────────── */
function HeroIllustration() {
    return (
        <svg
            viewBox="0 0 320 240"
            fill="none"
            aria-hidden="true"
            style={{ width: '100%', maxWidth: '340px', filter: 'drop-shadow(0 20px 40px rgba(99,102,241,0.3))' }}
        >
            {/* Central circle */}
            <circle cx="160" cy="120" r="72" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" />
            <circle cx="160" cy="120" r="50" fill="rgba(168,85,247,0.1)" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />

            {/* Zap center */}
            <g transform="translate(140,100)">
                <rect width="40" height="40" rx="10" fill="rgba(99,102,241,0.25)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
                {/* lightning icon */}
                <polygon points="22,6 14,22 20,22 18,34 26,18 20,18" fill="#818cf8" />
            </g>

            {/* Orbit ring */}
            <circle cx="160" cy="120" r="100" stroke="rgba(99,102,241,0.15)" strokeWidth="1" strokeDasharray="4 6" />

            {/* Orbiting nodes */}
            <circle cx="160" cy="20" r="14" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="160" y="25" textAnchor="middle" fontSize="11" fill="#60a5fa">🏆</text>

            <circle cx="260" cy="120" r="14" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5" />
            <text x="260" y="125" textAnchor="middle" fontSize="11" fill="#c084fc">⚡</text>

            <circle cx="160" cy="220" r="14" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5" />
            <text x="160" y="225" textAnchor="middle" fontSize="11" fill="#4ade80">✓</text>

            <circle cx="60" cy="120" r="14" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="60" y="125" textAnchor="middle" fontSize="11" fill="#fbbf24">🎯</text>

            {/* Connection lines */}
            <line x1="160" y1="34" x2="160" y2="70" stroke="rgba(99,102,241,0.3)" strokeWidth="1" strokeDasharray="3 4" />
            <line x1="246" y1="120" x2="210" y2="120" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="3 4" />
            <line x1="160" y1="206" x2="160" y2="170" stroke="rgba(34,197,94,0.3)" strokeWidth="1" strokeDasharray="3 4" />
            <line x1="74" y1="120" x2="110" y2="120" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3 4" />

            {/* Floating XP chip */}
            <rect x="200" y="46" width="80" height="26" rx="13" fill="rgba(15,23,42,0.9)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
            <text x="240" y="64" textAnchor="middle" fontSize="10" fill="#a5b4fc" fontWeight="600">+1,240 XP</text>

            {/* Floating verified chip */}
            <rect x="38" y="150" width="84" height="26" rx="13" fill="rgba(15,23,42,0.9)" stroke="rgba(34,197,94,0.4)" strokeWidth="1" />
            <text x="80" y="168" textAnchor="middle" fontSize="10" fill="#4ade80" fontWeight="600">✓ Verified</text>
        </svg>
    );
}

/* ── Left Branding Panel ─────────────────────────────────────────────── */
export function AuthLeftPanel() {
    return (
        <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden', minHeight: '100vh',
        }}>
            {/* Background orbs */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px',
                    borderRadius: '50%', filter: 'blur(60px)',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                    animation: 'hero-pulse 5s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px',
                    borderRadius: '50%', filter: 'blur(50px)',
                    background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
                    animation: 'hero-pulse 6s ease-in-out infinite 2s',
                }} />
                {/* Grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px' }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '3rem' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        boxShadow: '0 0 20px rgba(99,102,241,0.5)',
                    }}>
                        <Zap size={20} color="white" />
                    </div>
                    <span style={{
                        fontWeight: 800, fontSize: '1.375rem', letterSpacing: '-0.02em',
                        background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                        SkillSync
                    </span>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900,
                    color: 'var(--text-primary)', margin: '0 0 1rem', lineHeight: 1.15,
                    letterSpacing: '-0.025em',
                }}>
                    Your Peer Learning
                    <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 40%, #c084fc 70%, #e879f9 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        backgroundSize: '200% 200%', animation: 'gradient-shift 5s ease infinite',
                    }}>
                        Network Awaits.
                    </span>
                </h1>
                <p style={{
                    color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7,
                    margin: '0 0 2.5rem',
                }}>
                    Connect with verified student mentors, exchange skills, and earn XP — all in one platform built for learners.
                </p>

                {/* Illustration */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 2.5rem', animation: 'float-slow 8s ease-in-out infinite' }}>
                    <HeroIllustration />
                </div>

                {/* Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {HIGHLIGHTS.map(({ icon: Icon, color, label, sub }) => (
                        <div key={label} style={{
                            display: 'flex', alignItems: 'center', gap: '0.875rem',
                            padding: '0.75rem 1rem', borderRadius: '14px',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(8px)',
                            transition: 'border-color 0.25s, background 0.25s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.background = `${color}08`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                background: `${color}18`, border: `1px solid ${color}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon size={18} color={color} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{label}</p>
                                <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--text-muted)' }}>{sub}</p>
                            </div>
                            <div style={{
                                marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%',
                                background: color, boxShadow: `0 0 6px ${color}`,
                                flexShrink: 0,
                            }} />
                        </div>
                    ))}
                </div>

                {/* Trust bar */}
                <div style={{
                    marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.875rem 1.25rem', borderRadius: '14px',
                    background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
                }}>
                    <div style={{ display: 'flex' }}>
                        {['#3B82F6', '#8B5CF6', '#a855f7', '#22c55e'].map((c, i) => (
                            <div key={i} style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: `linear-gradient(135deg, ${c}, #6366f1)`,
                                border: '2px solid var(--bg-base)',
                                marginLeft: i > 0 ? '-8px' : 0, fontSize: '0.6rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 700,
                            }}>
                                {['R', 'A', 'D', 'M'][i]}
                            </div>
                        ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>500+</strong> students already joined
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ── Auth Page Shell ─────────────────────────────────────────────────── */
export default function AuthLayout({ children }) {
    const { isDark, toggleTheme } = useTheme();
    const { navigate } = useRouter();

    return (
        <div style={{
            display: 'flex', minHeight: '100vh',
            background: 'var(--bg-base)', position: 'relative',
        }}>
            {/* Left panel — hidden on mobile */}
            <div style={{
                display: 'none',
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-color)',
                minWidth: '480px', maxWidth: '520px',
            }} className="auth-left-panel">
                <AuthLeftPanel />
            </div>

            {/* Right panel */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '2rem 1.5rem', position: 'relative', minHeight: '100vh',
            }}>
                {/* Background ambient */}
                <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                    <div style={{
                        position: 'absolute', top: '20%', right: '10%',
                        width: '300px', height: '300px', borderRadius: '50%', filter: 'blur(50px)',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '15%', left: '5%',
                        width: '250px', height: '250px', borderRadius: '50%', filter: 'blur(40px)',
                        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
                    }} />
                </div>

                {/* Top-right controls */}
                <div style={{
                    position: 'fixed', top: '1rem', right: '1.25rem', zIndex: 10,
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                }}>
                    <button
                        id="auth-theme-toggle"
                        type="button"
                        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                        onClick={toggleTheme}
                        style={{
                            width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-color)',
                            background: 'var(--bg-elevated)', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.color = '#818cf8'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('landing')}
                        style={{
                            padding: '0 0.875rem', height: '36px', borderRadius: '10px',
                            border: '1px solid var(--border-color)', background: 'var(--bg-elevated)',
                            cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                            color: 'var(--text-secondary)', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        ← Back to home
                    </button>
                </div>

                {/* Mobile logo */}
                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', marginBottom: '0.5rem' }}
                    className="auth-mobile-logo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '9px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 12px rgba(99,102,241,0.45)',
                        }}>
                            <Zap size={16} color="white" />
                        </div>
                        <span style={{
                            fontWeight: 800, fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>SkillSync</span>
                    </div>
                </div>

                {/* Form content */}
                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>
                    {children}
                </div>
            </div>

            <style>{`
        @media (min-width: 900px) {
          .auth-left-panel  { display: flex !important; flex-direction: column; }
          .auth-mobile-logo { display: none !important; }
        }
        @media (max-width: 899px) {
          .auth-mobile-logo { display: block !important; }
        }
        
        /* Light theme overrides for left panel */
        :root.light .auth-left-panel {
          background: linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%);
        }
      `}</style>
        </div>
    );
}

// End AuthLayout
