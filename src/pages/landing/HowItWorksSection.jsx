import { useEffect, useRef } from 'react';
import { Search, UserCheck, CalendarDays, Sparkles } from 'lucide-react';

const STEPS = [
    {
        step: '01', icon: Search, label: 'Discover Skills',
        desc: 'Browse our curated Skill Marketplace. Filter by category, level, or mentor rating to find exactly what you need.',
        color: '#3B82F6',
    },
    {
        step: '02', icon: UserCheck, label: 'Connect with Mentors',
        desc: 'View mentor profiles, assessments scores, and peer reviews. Send a connection request to your chosen verified mentor.',
        color: '#6366f1',
    },
    {
        step: '03', icon: CalendarDays, label: 'Book a Session',
        desc: 'Pick a time that works for both of you. Confirm your session with one click and receive an instant calendar invite.',
        color: '#8B5CF6',
    },
    {
        step: '04', icon: Sparkles, label: 'Learn & Earn XP',
        desc: 'Attend the session, apply your skills, and leave a review. Earn XP for every interaction and climb the leaderboard.',
        color: '#a855f7',
    },
];

export default function HowItWorksSection() {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            }),
            { threshold: 0.12 },
        );
        ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="how-it-works"
            aria-labelledby="how-heading"
            ref={ref}
            style={{
                padding: '6rem 1.5rem',
                background: 'linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.04) 40%, rgba(139,92,246,0.04) 80%, transparent 100%)',
            }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header */}
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.35rem 1rem', borderRadius: '999px',
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                        marginBottom: '1rem',
                    }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#60a5fa' }}>🚀 How It Works</span>
                    </div>
                    <h2
                        id="how-heading"
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900,
                            color: 'var(--text-primary)', margin: '0 0 1rem', letterSpacing: '-0.02em',
                        }}
                    >
                        Get Started in{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            4 Simple Steps
                        </span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', margin: 0 }}>
                        From discovery to mastery — SkillSync makes peer learning effortless.
                    </p>
                </div>

                {/* Steps */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '2rem',
                    position: 'relative',
                }}>
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.step}
                                className={`reveal reveal-delay-${i + 1}`}
                                style={{ textAlign: 'center', position: 'relative' }}
                            >
                                {/* Connector line (desktop) */}
                                {i < STEPS.length - 1 && (
                                    <div aria-hidden="true" style={{
                                        display: 'none',
                                        position: 'absolute', top: '36px',
                                        left: 'calc(50% + 36px)', right: 'calc(-50% + 36px)',
                                        height: '2px',
                                        background: `linear-gradient(90deg, ${step.color}88, ${STEPS[i + 1].color}44)`,
                                    }} className="step-line" />
                                )}

                                {/* Icon circle */}
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '72px', height: '72px', borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                                        border: `2px solid ${step.color}55`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto',
                                        boxShadow: `0 0 0 8px ${step.color}0a`,
                                        transition: 'box-shadow 0.3s, border-color 0.3s',
                                    }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.boxShadow = `0 0 0 12px ${step.color}18, 0 8px 24px ${step.color}44`;
                                            e.currentTarget.style.borderColor = step.color;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.boxShadow = `0 0 0 8px ${step.color}0a`;
                                            e.currentTarget.style.borderColor = `${step.color}55`;
                                        }}
                                    >
                                        <Icon size={28} color={step.color} />
                                    </div>
                                    {/* Step number */}
                                    <span style={{
                                        position: 'absolute', top: '-6px', right: '-6px',
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${step.color}, #a855f7)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.65rem', fontWeight: 800, color: 'white',
                                    }}>
                                        {i + 1}
                                    </span>
                                </div>

                                <div style={{
                                    display: 'inline-block', fontSize: '0.7rem', fontWeight: 700,
                                    color: step.color, letterSpacing: '0.1em', textTransform: 'uppercase',
                                    marginBottom: '0.5rem',
                                }}>
                                    Step {step.step}
                                </div>
                                <h3 style={{
                                    fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)',
                                    margin: '0 0 0.75rem',
                                }}>
                                    {step.label}
                                </h3>
                                <p style={{
                                    fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                                    margin: 0,
                                }}>
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
        @media (min-width: 768px) { .step-line { display: block !important; } }
      `}</style>
        </section>
    );
}
