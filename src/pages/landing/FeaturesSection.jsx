import { useEffect, useRef } from 'react';
import {
    ShoppingBag, ShieldCheck, ClipboardList,
    CalendarCheck, MessageCircle, Trophy,
} from 'lucide-react';

const FEATURES = [
    {
        icon: ShoppingBag, label: 'Skill Marketplace',
        color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',
        desc: 'Browse and offer skills in a dynamic marketplace. Find the right peer for any skill — from coding to design, writing to data science.',
        badge: 'Popular',
    },
    {
        icon: ShieldCheck, label: 'Verified Mentor Program',
        color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',
        desc: 'Earn a Verified Mentor badge by passing skill assessments. Build credibility and get discovered by peers looking for guidance.',
        badge: 'Exclusive',
    },
    {
        icon: ClipboardList, label: 'Mentor Assessment',
        color: '#a855f7', bg: 'rgba(168,85,247,0.1)',
        desc: 'Take structured assessments to prove your expertise. Unlock mentor privileges, higher XP multipliers, and priority listing.',
        badge: null,
    },
    {
        icon: CalendarCheck, label: 'Session Booking',
        color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',
        desc: 'Seamlessly schedule 1-on-1 or group skill sessions. Automated reminders, calendar sync, and built-in review system included.',
        badge: null,
    },
    {
        icon: MessageCircle, label: 'Real-Time Chat',
        color: '#34d399', bg: 'rgba(52,211,153,0.1)',
        desc: 'Chat with mentors or peers in real time. Share code snippets, files, and resources directly in your session thread.',
        badge: null,
    },
    {
        icon: Trophy, label: 'Leaderboard & XP',
        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
        desc: 'Earn XP for every session, review, and contribution. Climb the leaderboard to unlock exclusive rewards and recognition.',
        badge: 'Trending',
    },
];

function FeatureCard({ feature, index }) {
    const Icon = feature.icon;
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal reveal-delay-${(index % 3) + 1}`}
            style={{
                borderRadius: '20px',
                background: 'var(--bg-elevated)',
                padding: '1.75rem',
                position: 'relative', overflow: 'hidden',
            }}
            aria-label={feature.label}
        >
            {/* Card animated border on hover via CSS class */}
            <div className="feature-card" style={{
                position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            }} />

            {/* Glow orb */}
            <div aria-hidden="true" style={{
                position: 'absolute', top: '-20px', right: '-20px',
                width: '120px', height: '120px', borderRadius: '50%',
                background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
                transition: 'opacity 0.3s',
            }} />

            {/* Badge */}
            {feature.badge && (
                <span style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                    borderRadius: '999px', background: `${feature.color}22`,
                    color: feature.color, border: `1px solid ${feature.color}44`,
                }}>
                    {feature.badge}
                </span>
            )}

            {/* Icon */}
            <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: feature.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '1.25rem', flexShrink: 0,
                border: `1px solid ${feature.color}33`,
            }}>
                <Icon size={24} color={feature.color} />
            </div>

            <h3 style={{
                fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)',
                margin: '0 0 0.625rem',
            }}>
                {feature.label}
            </h3>
            <p style={{
                fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                margin: 0,
            }}>
                {feature.desc}
            </p>

            {/* Learn more link */}
            <a
                href="#"
                onClick={e => e.preventDefault()}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    marginTop: '1.25rem', fontSize: '0.8125rem', fontWeight: 600,
                    color: feature.color, textDecoration: 'none', transition: 'gap 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.gap = '0.6rem'; }}
                onMouseLeave={e => { e.currentTarget.style.gap = '0.35rem'; }}
            >
                Learn more →
            </a>
        </div>
    );
}

export default function FeaturesSection() {
    return (
        <section
            id="features"
            aria-labelledby="features-heading"
            style={{ padding: '6rem 1.5rem' }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.35rem 1rem', borderRadius: '999px',
                        background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
                        marginBottom: '1rem',
                    }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c084fc' }}>✨ Platform Features</span>
                    </div>
                    <h2
                        id="features-heading"
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900,
                            color: 'var(--text-primary)', margin: '0 0 1rem',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Everything You Need to{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Grow Your Skills
                        </span>
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)', fontSize: '1.0625rem',
                        maxWidth: '560px', margin: '0 auto', lineHeight: 1.7,
                    }}>
                        A complete ecosystem for skill exchange — from finding mentors to earning recognition.
                    </p>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {FEATURES.map((feature, i) => (
                        <FeatureCard key={feature.label} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
