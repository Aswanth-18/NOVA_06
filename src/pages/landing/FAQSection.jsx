import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        q: 'What is SkillSync?',
        a: 'SkillSync is a student-focused peer skill exchange platform. It lets you learn directly from verified student mentors, offer your own skills, book sessions, and earn XP — all in one place.',
    },
    {
        q: 'How do I become a Verified Mentor?',
        a: 'Sign up, head to the Mentor Assessment section, and take the skill test for your area of expertise. Pass the assessment and your profile gets the Verified Mentor badge, giving you priority listing and XP bonuses.',
    },
    {
        q: 'Is SkillSync free to use?',
        a: 'Yes! SkillSync is free to join and browse. Core features including session booking, real-time chat, and XP tracking are available at no cost. Premium features like priority mentor listing and extended analytics are part of our Pro tier.',
    },
    {
        q: 'How does the skill exchange work?',
        a: 'Think of it as a talent swap. You offer a skill you\'re proficient in (e.g., graphic design) and request a skill you want to learn (e.g., Python). SkillSync matches you with peers who need what you offer and offer what you need.',
    },
    {
        q: 'What happens if I miss a session?',
        a: 'You\'ll receive automated reminders 24 hours and 1 hour before your session. If you need to cancel, you can do so up to 2 hours before without any XP penalty. Repeated no-shows may temporarily affect your mentor rating.',
    },
    {
        q: 'How is XP calculated?',
        a: 'XP is earned through completing sessions (base XP), leaving reviews (+50 XP), receiving 5-star ratings (+100 XP), and passing assessments (+500 XP). Verified Mentors get a 1.5× XP multiplier on all activities.',
    },
];

function FAQItem({ faq, index }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{
                borderRadius: '16px',
                background: 'var(--bg-elevated)',
                border: `1px solid ${open ? 'rgba(99,102,241,0.45)' : 'var(--border-color)'}`,
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
                marginBottom: '0.75rem',
            }}
        >
            <button
                id={`faq-btn-${index}`}
                type="button"
                aria-expanded={open}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpen(s => !s)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', padding: '1.25rem 1.5rem', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                }}
            >
                <span style={{
                    fontSize: '1rem', fontWeight: 600,
                    color: open ? '#818cf8' : 'var(--text-primary)',
                    transition: 'color 0.2s',
                }}>
                    {faq.q}
                </span>
                <span style={{
                    flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px',
                    background: open ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: open ? '#818cf8' : 'var(--text-muted)',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease, background 0.2s, color 0.2s',
                }}>
                    <ChevronDown size={16} />
                </span>
            </button>

            <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-btn-${index}`}
                className={`faq-answer${open ? ' open' : ''}`}
            >
                <p style={{
                    margin: 0, padding: '0 1.5rem 1.25rem',
                    fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75,
                }}>
                    {faq.a}
                </p>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
            }),
            { threshold: 0.1 },
        );
        ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            ref={ref}
            style={{
                padding: '6rem 1.5rem',
                background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.04) 50%, transparent 100%)',
            }}
        >
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.35rem 1rem', borderRadius: '999px',
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                        marginBottom: '1rem',
                    }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc' }}>❓ FAQ</span>
                    </div>
                    <h2
                        id="faq-heading"
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900,
                            color: 'var(--text-primary)', margin: '0 0 1rem', letterSpacing: '-0.02em',
                        }}
                    >
                        Frequently Asked{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Questions
                        </span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', margin: 0 }}>
                        Can't find what you're looking for?{' '}
                        <a href="#" onClick={e => e.preventDefault()} style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
                            Contact us
                        </a>
                    </p>
                </div>

                <div className="reveal reveal-delay-1">
                    {FAQS.map((faq, i) => (
                        <FAQItem key={i} faq={faq} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
