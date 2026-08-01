import { useEffect, useRef } from 'react';
import { ArrowRight, Play, Star, Users, Zap } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

const FLOATING_BADGES = [
    { icon: '🏆', label: 'Top Mentor', sub: '500+ sessions', top: '15%', left: '4%', delay: '0s' },
    { icon: '⚡', label: 'Skill Verified', sub: 'React Expert', top: '60%', left: '2%', delay: '1.5s' },
    { icon: '🎯', label: 'XP Earned', sub: '+1,240 XP today', top: '20%', right: '3%', delay: '0.8s' },
    { icon: '🌟', label: 'Session Live', sub: 'Python Basics', top: '65%', right: '2%', delay: '2s' },
];

export default function HeroSection() {
    const orbRef = useRef(null);
    const { navigate } = useRouter();

    // Parallax on mouse move
    useEffect(() => {
        const handler = (e) => {
            if (!orbRef.current) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };
        window.addEventListener('mousemove', handler, { passive: true });
        return () => window.removeEventListener('mousemove', handler);
    }, []);

    return (
        <section
            id="hero"
            aria-label="Hero"
            style={{
                position: 'relative', minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', paddingTop: '68px',
            }}
        >
            {/* Background orbs */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div ref={orbRef} style={{ position: 'absolute', inset: 0, transition: 'transform 0.1s linear' }}>
                    <div style={{
                        position: 'absolute', top: '15%', left: '20%',
                        width: '480px', height: '480px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        animation: 'hero-pulse 4s ease-in-out infinite',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '10%', right: '15%',
                        width: '360px', height: '360px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        animation: 'hero-pulse 5s ease-in-out infinite 1.5s',
                    }} />
                    <div style={{
                        position: 'absolute', top: '40%', right: '25%',
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(217,70,239,0.12) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }} />
                </div>

                {/* Subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                {/* Star particles */}
                {[...Array(20)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        top: `${10 + (i * 37) % 80}%`,
                        left: `${5 + (i * 53) % 90}%`,
                        width: i % 3 === 0 ? '3px' : '2px',
                        height: i % 3 === 0 ? '3px' : '2px',
                        borderRadius: '50%',
                        background: i % 2 === 0 ? '#818cf8' : '#c084fc',
                        animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
                    }} />
                ))}
            </div>

            {/* Floating UI badges */}
            {FLOATING_BADGES.map((badge, i) => (
                <div
                    key={i}
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: badge.top, left: badge.left, right: badge.right,
                        animation: `float ${5 + i}s ease-in-out infinite ${badge.delay}`,
                        zIndex: 2,
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.625rem 0.875rem', borderRadius: '14px',
                        background: 'rgba(15,23,42,0.85)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        maxWidth: '180px',
                        pointerEvents: 'none',
                    }}
                    className="hidden-mobile"
                >
                    <span style={{ fontSize: '1.25rem' }}>{badge.icon}</span>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#f1f5f9' }}>{badge.label}</p>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>{badge.sub}</p>
                    </div>
                </div>
            ))}

            {/* Hero Content */}
            <div style={{
                position: 'relative', zIndex: 3, textAlign: 'center',
                maxWidth: '820px', padding: '0 1.5rem', margin: '0 auto',
            }}>
                {/* Badge pill */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.4rem 1rem', borderRadius: '999px',
                    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                    marginBottom: '1.75rem', animation: 'slideInRight 0.6s ease forwards',
                }}>
                    <Zap size={13} color="#818cf8" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#a5b4fc' }}>
                        Peer Learning, Reimagined
                    </span>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 700, color: 'white',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        padding: '0.15rem 0.5rem', borderRadius: '999px',
                    }}>NEW</span>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: 'clamp(2.25rem, 6vw, 4.25rem)',
                    fontWeight: 900, lineHeight: 1.08,
                    letterSpacing: '-0.03em', margin: '0 0 1.5rem',
                    animation: 'slideInLeft 0.7s ease 0.1s forwards', opacity: 0,
                }}>
                    <span style={{ color: 'var(--text-primary)' }}>Connect. Learn.</span>
                    <br />
                    <span className="hero-gradient-text">Teach. Grow Together.</span>
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: 'clamp(1rem, 2.2vw, 1.1875rem)', lineHeight: 1.75,
                    color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2.5rem',
                    animation: 'slideInLeft 0.7s ease 0.2s forwards', opacity: 0,
                }}>
                    SkillSync is the <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>official peer learning and student mentorship platform for Bannari Amman Institute of Technology (BIT)</strong> where you can learn from peers, become a certified student mentor through assessments, and collaborate to build real-world skills within the campus.
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '1rem', flexWrap: 'wrap',
                    animation: 'fadeIn 0.7s ease 0.35s forwards', opacity: 0,
                }}>
                    <a
                        href="#register"
                        id="hero-cta-primary"
                        onClick={e => { e.preventDefault(); navigate('register'); }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700,
                            fontSize: '0.9375rem', textDecoration: 'none', color: 'white',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #6366f1 50%, #8B5CF6 100%)',
                            boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                            transition: 'all 0.25s ease', backgroundSize: '200% 200%',
                            animation: 'gradient-shift 4s ease infinite',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(59,130,246,0.55)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.4)'; }}
                    >
                        Get Started <ArrowRight size={17} />
                    </a>

                    <a
                        href="#skills"
                        id="hero-cta-secondary"
                        onClick={e => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.875rem 1.875rem', borderRadius: '12px', fontWeight: 600,
                            fontSize: '0.9375rem', textDecoration: 'none',
                            color: 'var(--text-primary)',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(99,102,241,0.35)',
                            backdropFilter: 'blur(12px)',
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
                    >
                        <Play size={15} /> Explore Skills
                    </a>
                </div>

                {/* Social proof */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap',
                    animation: 'fadeIn 0.7s ease 0.5s forwards', opacity: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
                            4.9 / 5 from <strong style={{ color: 'var(--text-primary)' }}>300+</strong> students
                        </span>
                    </div>
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-color)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Users size={14} color="#818cf8" />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>500+</strong> active students
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } }
      `}</style>
        </section>
    );
}
