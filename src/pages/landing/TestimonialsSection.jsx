import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Priya Nair',
        role: 'CSE, 3rd Year',
        initials: 'PN',
        color: '#3B82F6',
        stars: 5,
        quote:
            'SkillSync completely changed how I approach learning. I connected with a verified mentor for React in under 10 minutes. The XP system keeps me motivated every single day!',
        badge: '🏅 Verified Learner',
    },
    {
        name: 'Arjun Mehta',
        role: 'Verified Mentor · Python & ML',
        initials: 'AM',
        color: '#8B5CF6',
        stars: 5,
        quote:
            'I passed the Mentor Assessment and unlocked mentor status within a week. Helping other students has boosted my own understanding massively. The session booking system is seamless.',
        badge: '⚡ Top Mentor',
    },
    {
        name: 'Sarah Lin',
        role: 'AI & DS, Final Year',
        initials: 'SL',
        color: '#a855f7',
        stars: 5,
        quote:
            'The Skill Marketplace is incredible. I exchanged my UI/UX skills for data visualization tutoring. Real value, real connections — not just videos you watch alone at 2 AM.',
        badge: '🎯 Skill Exchanger',
    },
];

function Stars({ count }) {
    return (
        <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
            {[...Array(count)].map((_, i) => (
                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
            ))}
        </div>
    );
}

export default function TestimonialsSection() {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            }),
            { threshold: 0.1 },
        );
        ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="testimonials"
            aria-labelledby="testimonials-heading"
            ref={ref}
            style={{ padding: '6rem 1.5rem' }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header */}
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.35rem 1rem', borderRadius: '999px',
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                        marginBottom: '1rem',
                    }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>⭐ Student Stories</span>
                    </div>
                    <h2
                        id="testimonials-heading"
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900,
                            color: 'var(--text-primary)', margin: '0 0 1rem', letterSpacing: '-0.02em',
                        }}
                    >
                        Loved by Students{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>Everywhere</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', margin: 0 }}>
                        Don't take our word for it — here's what our community says.
                    </p>
                </div>

                {/* Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={t.name}
                            className={`reveal reveal-delay-${i + 1}`}
                            style={{
                                borderRadius: '20px', padding: '2rem',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-color)',
                                position: 'relative', overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = `0 24px 60px ${t.color}25`;
                                e.currentTarget.style.borderColor = `${t.color}55`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            {/* BG glow */}
                            <div aria-hidden="true" style={{
                                position: 'absolute', top: '-30px', right: '-30px',
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: `radial-gradient(circle, ${t.color}18 0%, transparent 70%)`,
                                pointerEvents: 'none',
                            }} />

                            {/* Quote mark */}
                            <div aria-hidden="true" style={{
                                position: 'absolute', top: '1.25rem', right: '1.5rem',
                                fontSize: '4rem', lineHeight: 1, color: `${t.color}22`,
                                fontFamily: 'Georgia, serif', fontWeight: 900, pointerEvents: 'none',
                            }}>
                                "
                            </div>

                            {/* Stars */}
                            <Stars count={t.stars} />

                            {/* Quote */}
                            <blockquote style={{
                                margin: '0 0 1.5rem', fontSize: '0.9375rem',
                                color: 'var(--text-secondary)', lineHeight: 1.75,
                                fontStyle: 'italic',
                            }}>
                                "{t.quote}"
                            </blockquote>

                            {/* Author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                    background: `linear-gradient(135deg, ${t.color}, #a855f7)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.8125rem', fontWeight: 700, color: 'white',
                                }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                                        {t.name}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {t.role}
                                    </p>
                                </div>
                                <span style={{
                                    marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 600,
                                    color: t.color, background: `${t.color}15`,
                                    border: `1px solid ${t.color}33`, padding: '0.2rem 0.6rem',
                                    borderRadius: '999px', flexShrink: 0,
                                }}>
                                    {t.badge}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
