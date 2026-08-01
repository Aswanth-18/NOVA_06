import { useEffect, useRef } from 'react';
import { Trophy, Star, Zap, TrendingUp } from 'lucide-react';

const TOP_USERS = [
    { rank: 1, name: 'Rohan Verma', skill: 'Full-Stack Dev', xp: 12840, badge: '👑', color: '#f59e0b' },
    { rank: 2, name: 'Ayesha Khan', skill: 'Data Science', xp: 11500, badge: '🥈', color: '#94a3b8' },
    { rank: 3, name: 'Dev Patel', skill: 'UI/UX', xp: 9820, badge: '🥉', color: '#cd7c3f' },
    { rank: 4, name: 'Meera Iyer', skill: 'AI & Machine Learning', xp: 8760, badge: '⚡', color: '#6366f1' },
    { rank: 5, name: 'Chris Mathews', skill: 'Cybersecurity', xp: 7940, badge: '🔥', color: '#a855f7' },
];

function RankBadge({ rank, color }) {
    return (
        <div style={{
            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
            background: rank <= 3 ? `linear-gradient(135deg, ${color}33, ${color}11)` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${rank <= 3 ? color + '55' : 'var(--border-color)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: rank <= 3 ? '1rem' : '0.8rem', fontWeight: 700,
            color: rank <= 3 ? color : 'var(--text-muted)',
        }}>
            {rank <= 3
                ? TOP_USERS.find(u => u.rank === rank)?.badge
                : `#${rank}`}
        </div>
    );
}

export default function LeaderboardSection() {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
            }),
            { threshold: 0.1 },
        );
        ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="leaderboard"
            aria-labelledby="leaderboard-heading"
            ref={ref}
            style={{ padding: '6rem 1.5rem' }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr',
                    gap: '3rem', alignItems: 'center',
                }}
                    className="leaderboard-grid"
                >
                    {/* Left: Text */}
                    <div className="reveal">
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.35rem 1rem', borderRadius: '999px',
                            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                            marginBottom: '1.25rem',
                        }}>
                            <TrendingUp size={13} color="#fbbf24" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>🏆 Leaderboard</span>
                        </div>
                        <h2
                            id="leaderboard-heading"
                            style={{
                                fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900,
                                color: 'var(--text-primary)', margin: '0 0 1.25rem', letterSpacing: '-0.02em',
                            }}
                        >
                            Climb the Ranks,{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                Earn Glory
                            </span>
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)', fontSize: '1.0625rem',
                            lineHeight: 1.75, margin: '0 0 2rem',
                        }}>
                            Every session you attend, every skill you share, and every review you leave earns you <strong style={{ color: 'var(--text-primary)' }}>XP</strong>. Climb the global leaderboard to unlock exclusive rewards, mentor badges, and recognition from the community.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                                { icon: Zap, label: 'Earn XP', sub: 'Every interaction counts' },
                                { icon: Star, label: 'Unlock Badges', sub: 'Verified Mentor & more' },
                                { icon: Trophy, label: 'Win Rewards', sub: 'Monthly top earners' },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Icon size={16} color="#f59e0b" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{label}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Leaderboard card */}
                    <div className="reveal reveal-delay-2">
                        <div style={{
                            borderRadius: '24px', overflow: 'hidden',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                        }}>
                            {/* Card header */}
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                            }}>
                                <Trophy size={20} color="#f59e0b" />
                                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                    Top Performers This Week
                                </span>
                                <span style={{
                                    marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 600,
                                    color: '#22c55e', background: 'rgba(34,197,94,0.12)',
                                    border: '1px solid rgba(34,197,94,0.25)',
                                    padding: '0.15rem 0.5rem', borderRadius: '999px',
                                }}>● Live</span>
                            </div>

                            {/* Rows */}
                            {TOP_USERS.map((user, i) => (
                                <div
                                    key={user.rank}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '0.875rem 1.5rem',
                                        borderBottom: i < TOP_USERS.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        transition: 'background 0.2s',
                                        background: user.rank === 1 ? 'rgba(245,158,11,0.04)' : 'transparent',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = user.rank === 1 ? 'rgba(245,158,11,0.04)' : 'transparent'; }}
                                >
                                    <RankBadge rank={user.rank} color={user.color} />

                                    {/* Avatar */}
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                                        background: `linear-gradient(135deg, ${user.color}, #a855f7)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 700, color: 'white',
                                    }}>
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {user.name}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.skill}</p>
                                    </div>

                                    {/* XP */}
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <p style={{
                                            margin: 0, fontWeight: 800, fontSize: '0.9375rem',
                                            background: `linear-gradient(135deg, ${user.color}, #a855f7)`,
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                        }}>
                                            {user.xp.toLocaleString()}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>XP</p>
                                    </div>
                                </div>
                            ))}

                            {/* Footer */}
                            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <a
                                    href="#"
                                    onClick={e => e.preventDefault()}
                                    style={{
                                        fontSize: '0.875rem', fontWeight: 600, color: '#818cf8',
                                        textDecoration: 'none', transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#c084fc'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#818cf8'; }}
                                >
                                    View Full Leaderboard →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (min-width: 900px) {
          .leaderboard-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
        </section>
    );
}
