import React, { useState } from 'react';
import {
    Edit3, Share2, BadgeCheck, ShieldCheck, Star, Zap, Trophy,
    BookOpen, CalendarCheck, TrendingUp, Award, Target, Clock,
    ChevronRight, ExternalLink, Users, Heart, Flame, Code2,
    Layers, Globe, Download, MapPin, GraduationCap, Briefcase,
    CheckCircle, Medal, Crown, BarChart2
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';

import { useAuth } from '../../context/AuthContext';

/* ─── Shared Avatar Component ────────────────────────────────────────────── */
function UserAvatar({ name, sizeClasses, color = '#6366f1' }) {
    const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    return (
        <div className={`${sizeClasses} rounded-full flex items-center justify-center font-extrabold text-white`}
            style={{
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                boxShadow: `0 4px 14px ${color}40`,
                border: '2px solid var(--bg-surface)'
            }}>
            {initials}
        </div>
    );
}

/* ─── Dummy Data ─────────────────────────────────────────────────────────── */
const DEFAULT_PROFILE = {
    name: 'Aswanth S',
    registerNumber: '731121104084', // Standard BIT dummy roll number style
    department: 'CSE',
    year: 'Prefinal Year (3rd)',
    college: 'Bannari Amman Institute of Technology',
    color: '#6366f1',
    cover: null,
    bio: 'Passionate Java programmer and aspiring ML engineer. I love solving DSA problems and preparing for placements. Currently exploring AI/ML and helping my juniors crack coding assessments.',
    careerGoal: 'Software Engineer at a top product company.',
    interests: ['Java Programming', 'Data Structures', 'AI & Machine Learning', 'Placement Prep', 'DBMS'],
    location: 'BIT Boys Hostel',
    isVerified: true,
    isMentor: true,
    socialLinks: { github: 'github.com/aswanth', linkedin: 'linkedin.com/in/aswanth' },
};

const STATS = [
    { label: 'Skills Teaching', value: '4', icon: BookOpen, color: '#6366f1' },
    { label: 'Skills Learning', value: '3', icon: TrendingUp, color: '#a855f7' },
    { label: 'Sessions Done', value: '61', icon: CalendarCheck, color: '#10b981' },
    { label: 'Total XP', value: '1,420', icon: Zap, color: '#f59e0b' },
    { label: 'Current Level', value: 'Lv. 19', icon: Target, color: '#38bdf8' },
    { label: 'Platform Rank', value: '#8', icon: Trophy, color: '#d946ef' },
];

const TEACH_SKILLS = [
    { name: 'Java Programming', icon: Code2, level: 'Advanced', pct: 88, color: '#6366f1' },
    { name: 'Data Structures', icon: Layers, level: 'Advanced', pct: 84, color: '#f59e0b' },
    { name: 'Aptitude', icon: Globe, level: 'Intermediate', pct: 70, color: '#38bdf8' },
    { name: 'DBMS', icon: Layers, level: 'Advanced', pct: 80, color: '#a855f7' },
];

const LEARN_SKILLS = [
    { name: 'AI & AI & Machine Learning', icon: BarChart2, level: 'Beginner', pct: 38, color: '#10b981' },
    { name: 'Python', icon: Code2, level: 'Intermediate', pct: 55, color: '#d946ef' },
    { name: 'Operating Systems', icon: Globe, level: 'Beginner', pct: 25, color: '#ef4444' },
];

const ACHIEVEMENTS = [
    { label: 'Verified Mentor', icon: '🥉', color: '#cd7f32', earned: true },
    { label: 'Placement Champion', icon: '🥈', color: '#9ca3af', earned: true },
    { label: 'Coding Star', icon: '🥇', color: '#f59e0b', earned: false },
    { label: 'Community Helper', icon: '⚡', color: '#6366f1', earned: true },
    { label: 'Top Mentor', icon: '🌟', color: '#a855f7', earned: true },
    { label: 'Hackathon Contributor', icon: '🤝', color: '#10b981', earned: false },
];

const REVIEWS = [
    { name: 'Rahul Sharma', color: '#f59e0b', rating: 5, text: 'Clear explanations and helpful guidance. Great mentor!', date: '2 days ago' },
    { name: 'Sneha Reddy', color: '#38bdf8', rating: 5, text: 'Broke down complex concepts into simple steps.', date: '1 week ago' },
    { name: 'Karthik Raja', color: '#ec4899', rating: 4, text: 'Really helpful session on DBMS normalization.', date: '2 weeks ago' },
];

const UPCOMING = {
    title: 'Resume Building & Interview Prep',
    mentor: 'Priya Nair',
    color: '#f59e0b',
    date: 'Aug 2, 2025',
    time: '4:00 PM',
    duration: '60 min',
};

const QUICK_ACTIONS = [
    { label: 'Edit Profile', icon: Edit3, color: '#6366f1', id: 'qa-edit' },
    { label: 'View Bookings', icon: CalendarCheck, color: '#10b981', id: 'qa-book' },
    { label: 'Explore Skills', icon: BookOpen, color: '#a855f7', id: 'qa-explore' },
    { label: 'Share Profile', icon: Share2, color: '#38bdf8', id: 'qa-share' },
];

/* ─── Sub-components ──────────────────────────────────────────────────────── */
function SkillBar({ skill }) {
    const levelColor = { Advanced: '#10b981', Intermediate: '#f59e0b', Beginner: '#38bdf8' };
    return (
        <div className="flex flex-col gap-1.5 p-3.5 bg-white/[0.02] border border-[var(--border-color)] rounded-xl hover:bg-white/[0.04] transition-all group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}30` }}>
                        <skill.icon size={15} style={{ color: skill.color }} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">{skill.name}</p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-wide mt-0.5"
                            style={{ color: levelColor[skill.level] || '#6366f1' }}>{skill.level}</p>
                    </div>
                </div>
                <span className="text-sm font-extrabold" style={{ color: skill.color }}>{skill.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${skill.pct}%`, background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})` }} />
            </div>
        </div>
    );
}

function Stars({ n }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={12}
                    fill={i < n ? '#f59e0b' : 'none'}
                    className={i < n ? 'text-amber-400' : 'text-[var(--text-muted)]'} />
            ))}
        </div>
    );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const profile = {
        ...DEFAULT_PROFILE,
        name: user?.fullName || DEFAULT_PROFILE.name,
        registerNumber: user?.registerNumber || DEFAULT_PROFILE.registerNumber,
        department: user?.department || DEFAULT_PROFILE.department,
        year: user?.year ? `Year ${user.year}` : DEFAULT_PROFILE.year,
        isMentor: user?.role === 'mentor',
    };

    return (
        <AppLayout pageTitle="My Profile" activeNavId="profile">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-7 pb-14" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* ── Hero Card ── */}
                <div className="glass border border-[var(--border-color)] rounded-2xl overflow-hidden">
                    {/* Cover strip */}
                    <div className="h-32 lg:h-40 relative"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.45) 0%, rgba(168,85,247,0.35) 50%, rgba(217,70,239,0.25) 100%)' }}>
                        <div className="absolute inset-0 opacity-30"
                            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%)' }} />
                        {/* Edit cover hint */}
                        <button id="edit-cover" className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white text-[0.65rem] font-bold transition-all border border-white/10">
                            <Edit3 size={11} /> Edit Cover
                        </button>
                    </div>

                    {/* Profile body */}
                    <div className="px-5 lg:px-8 pb-6 relative">
                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16">
                            <div className="relative inline-block">
                                <UserAvatar name={profile.name} sizeClasses="w-24 h-24 lg:w-28 lg:h-28 text-3xl lg:text-4xl" color={profile.color} />
                                {profile.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 2px 8px rgba(99,102,241,0.5)' }}>
                                        <BadgeCheck size={14} className="text-white" />
                                    </div>
                                )}
                            </div>
                            {/* Desktop action buttons */}
                            <div className="flex items-center gap-2.5 sm:mb-0">
                                <button id="share-profile"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                                    <Share2 size={13} /> Share
                                </button>
                                <button id="edit-profile"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                                    <Edit3 size={13} /> Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Name + meta */}
                        <div className="mt-4">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)]">{profile.name}</h1>
                                {profile.isVerified && (
                                    <span className="flex items-center gap-1 text-[0.62rem] font-bold px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/25">
                                        <BadgeCheck size={11} /> Verified {user?.role || 'Student'}
                                    </span>
                                )}
                                {profile.isMentor && (
                                    <span className="flex items-center gap-1 text-[0.62rem] font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/25">
                                        <ShieldCheck size={11} /> Mentor
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)] font-medium">
                                <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-[var(--text-muted)]" />{profile.registerNumber}</span>
                                <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-[var(--text-muted)]" />{profile.department}</span>
                                <span className="flex items-center gap-1.5"><Layers size={14} className="text-[var(--text-muted)]" />{profile.year}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[var(--text-muted)]" />{profile.location}</span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] font-medium mt-1 flex items-center gap-1.5">
                                <Globe size={12} /> {profile.college}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                    {STATS.map((s, i) => (
                        <div key={i} className="relative overflow-hidden glass border border-[var(--border-color)] rounded-2xl p-4 flex flex-col items-center text-center group hover:scale-[1.03] transition-all duration-300">
                            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full opacity-15 group-hover:opacity-25 blur-xl transition-opacity"
                                style={{ background: s.color }} />
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 relative z-10"
                                style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                                <s.icon size={17} style={{ color: s.color }} />
                            </div>
                            <p className="text-lg font-extrabold text-[var(--text-primary)] leading-none relative z-10">{s.value}</p>
                            <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[var(--text-muted)] mt-1 relative z-10">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Tab Navigation ── */}
                <div className="flex gap-1 p-1 glass rounded-xl border border-[var(--border-color)] w-fit overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {['overview', 'skills', 'achievements'].map(tab => (
                        <button key={tab} id={`profile-tab-${tab}`}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-brand-600 text-white shadow-md'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Main Content Grid ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* ─ Left / Main Column ─ */}
                    <div className="xl:col-span-2 flex flex-col gap-6">

                        {/* About Me */}
                        {(activeTab === 'overview' || activeTab === 'skills') && (
                            <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
                                <h2 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2 mb-4">
                                    <Heart size={16} className="text-red-400" /> About Me
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{profile.bio}</p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-[var(--border-color)] rounded-xl">
                                        <Briefcase size={15} className="text-brand-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Career Goal</p>
                                            <p className="text-sm text-[var(--text-secondary)] font-medium">{profile.careerGoal}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Interests</p>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.interests.map(tag => (
                                                <span key={tag} className="text-[0.68rem] font-bold px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills — Teaching */}
                        {(activeTab === 'overview' || activeTab === 'skills') && (
                            <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
                                <h2 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2 mb-4">
                                    <ShieldCheck size={16} className="text-brand-400" /> Skills I Teach
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {TEACH_SKILLS.map((s, i) => <SkillBar key={i} skill={s} />)}
                                </div>
                            </div>
                        )}

                        {/* Skills — Learning */}
                        {(activeTab === 'overview' || activeTab === 'skills') && (
                            <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
                                <h2 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2 mb-4">
                                    <TrendingUp size={16} className="text-purple-400" /> Skills I'm Learning
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {LEARN_SKILLS.map((s, i) => <SkillBar key={i} skill={s} />)}
                                </div>
                            </div>
                        )}

                        {/* Achievements */}
                        {(activeTab === 'overview' || activeTab === 'achievements') && (
                            <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
                                <h2 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2 mb-4">
                                    <Award size={16} className="text-amber-400" /> Achievements
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {ACHIEVEMENTS.map((a, i) => (
                                        <div key={i}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${a.earned
                                                ? 'bg-white/[0.03] border-[var(--border-color)] hover:scale-[1.03]'
                                                : 'bg-white/[0.01] border-dashed border-white/10 opacity-45'}`}>
                                            <div className={`text-3xl ${!a.earned ? 'grayscale' : ''}`}>{a.icon}</div>
                                            <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">{a.label}</p>
                                            {a.earned
                                                ? <span className="text-[0.58rem] font-bold text-emerald-400 flex items-center gap-0.5"><CheckCircle size={9} /> Earned</span>
                                                : <span className="text-[0.58rem] font-bold text-[var(--text-muted)]">Locked 🔒</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Reviews */}
                        {(activeTab === 'overview' || activeTab === 'achievements') && (
                            <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2">
                                        <Star size={16} className="text-amber-400" fill="#f59e0b" /> Reviews Received
                                    </h2>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                                        <Star size={12} className="text-amber-400" fill="#f59e0b" />
                                        <span className="text-xs font-extrabold text-amber-400">4.7 avg</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {REVIEWS.map((r, i) => (
                                        <div key={i} className="p-4 bg-white/[0.02] border border-[var(--border-color)] rounded-xl hover:bg-white/[0.04] transition-all">
                                            <div className="flex items-center gap-3 mb-3">
                                                <UserAvatar name={r.name} sizeClasses="w-9 h-9 text-xs" color={r.color} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-[var(--text-primary)]">{r.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Stars n={r.rating} />
                                                        <span className="text-[0.6rem] text-[var(--text-muted)] font-medium">{r.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">"{r.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─ Right Sidebar ─ */}
                    <div className="flex flex-col gap-5">

                        {/* Quick Actions */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <h3 className="font-extrabold text-sm text-[var(--text-primary)] mb-3">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                                {QUICK_ACTIONS.map((q, i) => (
                                    <button key={i} id={q.id}
                                        className="flex items-center justify-between gap-2 w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-[var(--border-color)] hover:bg-white/[0.05] hover:scale-[1.01] transition-all group text-left">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ background: `${q.color}15`, border: `1px solid ${q.color}25` }}>
                                                <q.icon size={13} style={{ color: q.color }} />
                                            </div>
                                            <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{q.label}</span>
                                        </div>
                                        <ChevronRight size={13} className="text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                ))}
                                {/* Apply as Mentor CTA */}
                                <div className="mt-1 p-3 rounded-xl border border-dashed border-brand-500/30 flex items-center gap-2.5 bg-brand-500/5">
                                    <ShieldCheck size={16} className="text-brand-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-brand-400">Apply as Mentor</p>
                                        <p className="text-[0.6rem] text-[var(--text-muted)] font-medium">Help peers & earn XP</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Session */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-3">
                                <CalendarCheck size={14} className="text-brand-400" /> Upcoming Session
                            </h3>
                            <div className="p-4 rounded-xl border"
                                style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
                                <p className="font-bold text-sm text-[var(--text-primary)] mb-3 leading-snug">{UPCOMING.title}</p>
                                <div className="flex items-center gap-2 mb-3">
                                    <UserAvatar name={UPCOMING.mentor} sizeClasses="w-7 h-7 text-[0.55rem]" color={UPCOMING.color} />
                                    <div>
                                        <p className="text-[0.65rem] font-bold text-[var(--text-primary)]">{UPCOMING.mentor}</p>
                                        <p className="text-[0.58rem] text-[var(--text-muted)] font-medium">Student Mentor</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-[0.65rem] font-medium text-[var(--text-muted)]">
                                        <CalendarCheck size={11} className="text-brand-400" />
                                        {UPCOMING.date} · {UPCOMING.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-[0.65rem] font-medium text-[var(--text-muted)]">
                                        <Clock size={11} className="text-brand-400" />
                                        Duration: {UPCOMING.duration}
                                    </div>
                                </div>
                                <button id="join-session" className="w-full mt-3 py-2 rounded-xl text-xs font-bold text-white transition-all"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                                    Join Session
                                </button>
                            </div>
                        </div>

                        {/* XP Progress */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-4">
                                <Zap size={14} className="text-amber-400" /> XP Progress
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                                    19
                                </div>
                                <div>
                                    <p className="font-extrabold text-[var(--text-primary)] text-sm">Level 19</p>
                                    <p className="text-[0.65rem] text-[var(--text-muted)] font-medium">Bronze Rank · 1,420 XP</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Next Level</span>
                                    <span className="text-[0.62rem] font-extrabold text-brand-400">1,420 / 5,000 XP</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className="h-full rounded-full"
                                        style={{ width: '86%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', boxShadow: '0 0 8px rgba(99,102,241,0.5)' }} />
                                </div>
                                <p className="text-[0.6rem] font-medium text-[var(--text-muted)] mt-1.5">86% — 680 XP to Level 20</p>
                            </div>
                            <div className="p-3 bg-amber-500/8 border border-amber-500/20 rounded-xl">
                                <p className="text-[0.65rem] font-bold text-amber-400 flex items-center gap-1.5">
                                    <Flame size={11} /> Next reward at Level 20
                                </p>
                                <p className="text-[0.6rem] text-[var(--text-muted)] font-medium mt-0.5">Silver Rank Badge + 500 bonus XP</p>
                            </div>
                        </div>

                        {/* Badges Earned */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-3">
                                <Medal size={14} className="text-purple-400" /> Earned Badges
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {ACHIEVEMENTS.filter(a => a.earned).map((a, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 p-2 bg-white/[0.02] border border-[var(--border-color)] rounded-xl hover:scale-110 transition-transform cursor-pointer">
                                        <span className="text-xl">{a.icon}</span>
                                        <span className="text-[0.5rem] font-bold text-[var(--text-muted)] text-center leading-tight">{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <h3 className="font-extrabold text-sm text-[var(--text-primary)] mb-3">Connect</h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    { label: 'GitHub', value: profile.socialLinks?.github || DEFAULT_PROFILE.socialLinks.github, color: '#e2e8f0' },
                                    { label: 'LinkedIn', value: profile.socialLinks?.linkedin || DEFAULT_PROFILE.socialLinks.linkedin, color: '#0ea5e9' },
                                ].map(s => (
                                    <a key={s.label} href={`https://${s.value}`} target="_blank" rel="noreferrer"
                                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-[var(--border-color)] hover:bg-white/[0.05] transition-all group">
                                        <div className="flex items-center gap-2">
                                            <Globe size={13} style={{ color: s.color }} />
                                            <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{s.label}</span>
                                        </div>
                                        <ExternalLink size={11} className="text-[var(--text-muted)] group-hover:text-brand-400 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
