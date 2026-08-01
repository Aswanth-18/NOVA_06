import { useEffect, useRef, useState } from 'react';

const STATS = [
    { value: 500, suffix: '+', label: 'BIT Students', icon: '🎓', color: '#60a5fa' },
    { value: 45, suffix: '+', label: 'Trained Peer Mentors', icon: '🏅', color: '#a78bfa' },
    { value: 400, suffix: '+', label: 'Skill Sessions', icon: '⚡', color: '#c084fc' },
    { value: 24, suffix: '+', label: 'Technical Skills', icon: '🎯', color: '#e879f9' },
];

function useCountUp(target, duration = 2000, started = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!started) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
        };
        requestAnimationFrame(step);
    }, [target, duration, started]);
    return count;
}

function StatCard({ stat, started, index }) {
    const count = useCountUp(stat.value, 2000 + index * 200, started);

    return (
        <div
            style={{
                textAlign: 'center', padding: '2rem 1.5rem',
                borderRadius: '20px', position: 'relative', overflow: 'hidden',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                animation: `slideInRight 0.6s ease ${index * 0.12}s both`,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 20px 48px ${stat.color}33`;
                e.currentTarget.style.borderColor = `${stat.color}66`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            {/* Glow bg */}
            <div aria-hidden="true" style={{
                position: 'absolute', top: '-30px', right: '-30px',
                width: '100px', height: '100px', borderRadius: '50%',
                background: `radial-gradient(circle, ${stat.color}22 0%, transparent 70%)`,
            }} />

            <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
            <div style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900,
                lineHeight: 1, marginBottom: '0.5rem',
                background: `linear-gradient(135deg, ${stat.color} 0%, #c084fc 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
                {count.toLocaleString()}{stat.suffix}
            </div>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {stat.label}
            </div>
        </div>
    );
}

export default function StatsSection() {
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
            { threshold: 0.3 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            id="stats"
            aria-label="Platform statistics"
            style={{
                padding: '5rem 1.5rem',
                background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.04) 50%, transparent 100%)',
            }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Section label */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.35rem 1rem', borderRadius: '999px',
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                        marginBottom: '1rem',
                    }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc' }}>
                            📊 Platform Stats
                        </span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800,
                        color: 'var(--text-primary)', margin: '0 0 0.75rem',
                    }}>
                        Trusted by BIT Students
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', margin: 0 }}>
                        Join a thriving peer learning network that grows every day.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {STATS.map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} started={started} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
