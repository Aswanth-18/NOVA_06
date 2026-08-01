import { Zap, GitBranch, Share2, Globe, Mail } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

const LINKS = {
    Company: ['About', 'Careers', 'Blog', 'Press'],
    Platform: ['Skill Marketplace', 'Mentor Program', 'Session Booking', 'Leaderboard'],
    Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
};

const SOCIAL = [
    { icon: Share2, label: 'Twitter', href: '#' },
    { icon: GitBranch, label: 'GitHub', href: '#' },
    { icon: Globe, label: 'LinkedIn', href: '#' },
    { icon: Mail, label: 'Email', href: '#' },
];

export default function FooterSection() {
    const { navigate } = useRouter();

    return (
        <footer
            id="about"
            role="contentinfo"
            style={{
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                padding: '4rem 1.5rem 2rem',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* CTA Banner */}
                <div style={{
                    borderRadius: '24px', padding: '3.5rem 2rem', marginBottom: '4rem',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(168,85,247,0.08) 100%)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                }}>
                    <div aria-hidden="true" style={{
                        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
                        width: '400px', height: '300px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.35rem 1rem', borderRadius: '999px',
                        background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                        marginBottom: '1.25rem',
                    }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc' }}>🎉 Join the Community</span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900,
                        color: 'var(--text-primary)', margin: '0 0 1rem', letterSpacing: '-0.02em',
                    }}>
                        Ready to{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #60a5fa, #c084fc)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Sync Your Skills?
                        </span>
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)', fontSize: '1.0625rem',
                        maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7,
                    }}>
                        Join 500+ students who are already learning, teaching, and growing together on SkillSync.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="#register"
                            id="footer-cta"
                            onClick={e => { e.preventDefault(); navigate('register'); }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700,
                                fontSize: '0.9375rem', textDecoration: 'none', color: 'white',
                                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                                transition: 'all 0.25s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(59,130,246,0.55)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.4)'; }}
                        >
                            <Zap size={16} /> Get Started Free
                        </a>
                        <a
                            href="#"
                            onClick={e => e.preventDefault()}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.875rem 1.75rem', borderRadius: '12px', fontWeight: 600,
                                fontSize: '0.9375rem', textDecoration: 'none', color: 'var(--text-primary)',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(99,102,241,0.35)',
                                transition: 'all 0.25s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        >
                            Contact Us
                        </a>
                    </div>
                </div>

                {/* Footer grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '3rem',
                }}>
                    {/* Brand */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                            <span style={{
                                width: '34px', height: '34px', borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                boxShadow: '0 0 12px rgba(99,102,241,0.4)',
                            }}>
                                <Zap size={16} color="white" />
                            </span>
                            <span style={{
                                fontWeight: 800, fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                SkillSync
                            </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
                            Peer learning, reinvented. Connect, learn, and grow with your community.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {SOCIAL.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    onClick={e => e.preventDefault()}
                                    aria-label={label}
                                    style={{
                                        width: '34px', height: '34px', borderRadius: '9px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
                                        color: 'var(--text-muted)', border: '1px solid var(--border-color)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Groups */}
                    {Object.entries(LINKS).map(([group, links]) => (
                        <div key={group}>
                            <h3 style={{
                                fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)',
                                textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 1rem',
                            }}>
                                {group}
                            </h3>
                            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                {links.map(link => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            onClick={e => e.preventDefault()}
                                            style={{
                                                fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none',
                                                transition: 'color 0.2s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '1rem',
                }}>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        © 2026 SkillSync. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                            <a
                                key={item} href="#" onClick={e => e.preventDefault()}
                                style={{
                                    fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
