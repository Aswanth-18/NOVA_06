import { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, ShieldCheck, Calendar, Trophy, CheckCircle2, Clock, Star,
    ChevronRight, BookOpen, MessageCircle, Play, Layers, RefreshCw, Users, Activity
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

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

export default function DashboardPage() {
    const { token, user } = useAuth();
    const { navigate } = useRouter();
    const { toast } = useToast();

    const role = user?.role || 'user';
    const isFaculty = role === 'faculty';
    const isAdmin = role === 'admin';
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    // isVerifiedMentor is derived from backend metrics (approvedSkillNames.length > 0)
    // Also check user flag as fallback while metrics are loading
    const isVerifiedMentor = (metrics?.approvedSkillNames?.length > 0) || user?.isVerifiedMentor || false;

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    // Fetch dynamic role-based dashboard metrics
    const fetchDashboardMetrics = useCallback(async () => {
        setLoading(true);
        try {
            const apiRole = isFaculty ? 'faculty' : isAdmin ? 'admin' : 'user';
            const endpoint = `${API_BASE_URL}/dashboard/${apiRole}`;
            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setMetrics(data.data);
            } else {
                // Fallback to general dashboard
                const fallbackRes = await fetch(`${API_BASE_URL}/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const fallbackData = await fallbackRes.json();
                if (fallbackData.success) {
                    setMetrics(fallbackData.data);
                }
            }
        } catch (err) {
            console.error('Fetch dashboard metrics error:', err);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to load dashboard metrics from backend.',
            });
        } finally {
            setLoading(false);
        }
    }, [token, isFaculty, isAdmin, toast]);

    useEffect(() => {
        fetchDashboardMetrics();
    }, [fetchDashboardMetrics]);

    // Build Learning Stat Cards for Users
    const getLearningStatCards = () => {
        if (!metrics) return [];
        return [
            { label: 'Total Sessions Booked', value: metrics.totalSessionsBooked ?? 0, icon: Calendar, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
            { label: 'Completed Sessions', value: metrics.completedSessions ?? 0, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
            { label: 'Upcoming Sessions', value: metrics.upcomingSessions ?? 0, icon: Clock, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
            { label: 'Pending Requests', value: metrics.pendingRequests ?? 0, icon: Activity, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        ];
    };

    // Build Teaching Stat Cards for Verified Mentors
    const getTeachingStatCards = () => {
        if (!metrics) return [];
        return [
            { label: 'Students Mentored', value: metrics.totalStudentsMentored ?? 0, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
            { label: 'Pending Requests', value: metrics.pendingBookingRequests ?? 0, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
            { label: 'Accepted Sessions', value: metrics.acceptedSessions ?? 0, icon: ShieldCheck, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
            { label: 'Completed Sessions Taught', value: metrics.completedSessionsTeaching ?? metrics.completedSessions ?? 0, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
        ];
    };

    // Faculty & Admin Stat Cards
    const getAdminFacultyStatCards = () => {
        if (!metrics) return [];
        if (isFaculty) {
            return [
                { label: 'Mentor Applications', value: metrics.totalMentorApplications ?? 0, icon: ShieldCheck, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
                { label: 'Pending Verifications', value: metrics.pendingVerifications ?? 0, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                { label: 'Approved Mentors', value: metrics.approvedMentors ?? 0, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                { label: 'Total Skills', value: metrics.totalSkills ?? 0, icon: Layers, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
            ];
        }
        if (isAdmin) {
            return [
                { label: 'Total Users', value: metrics.totalUsers ?? metrics.totalStudents ?? 0, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
                { label: 'Verified Mentors', value: metrics.totalMentors ?? 0, icon: ShieldCheck, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
                { label: 'Total Faculty', value: metrics.totalFaculty ?? 0, icon: Trophy, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
                { label: 'Sessions Completed', value: metrics.totalSessionsCompleted ?? 0, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
            ];
        }
        return [];
    };

    const learningStatCards = getLearningStatCards();
    const teachingStatCards = getTeachingStatCards();
    const adminFacultyStatCards = getAdminFacultyStatCards();

    return (
        <AppLayout pageTitle="Dashboard" activeNavId="dashboard">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-7 pb-10" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* ══ HERO BANNER ══════════════════════════════════════════ */}
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] p-6 lg:p-8"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.14) 50%, rgba(217,70,239,0.10) 100%)' }}>

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <UserAvatar name={user?.fullName || 'User'} sizeClasses="w-16 h-16 lg:w-20 lg:h-20 text-xl lg:text-2xl" color="#6366f1" />
                                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-400 border-3 border-[var(--bg-surface)]"
                                    style={{ border: '3px solid var(--bg-surface)', boxShadow: '0 0 8px #10b981' }} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-brand-300 opacity-80">{currentDate}</span>
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] leading-tight">
                                    Welcome back, {user?.fullName?.split(' ')[0] || 'User'} 👋
                                </h1>
                                <p className="text-sm text-[var(--text-secondary)] font-medium mt-0.5">
                                    SkillSync Real-time Dashboard Overview
                                </p>
                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                    <span className="flex items-center justify-center gap-1.5 text-[0.68rem] uppercase font-bold px-3 py-1.5 rounded-xl bg-brand-600/20 text-brand-300 border border-brand-500/25">
                                        <ShieldCheck size={11} /> {role.toUpperCase()}
                                    </span>
                                    {user?.department && (
                                        <span className="flex items-center gap-1.5 text-[0.68rem] font-bold px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25">
                                            <Trophy size={11} /> Dept: {user.department}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* XP Progress or Live Status */}
                        <div className="glass flex flex-col justify-center border border-[var(--border-color)] rounded-2xl p-4 min-w-[220px] flex-shrink-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-[var(--text-muted)]">XP Points</span>
                                <span className="text-sm font-extrabold text-brand-400">{metrics?.xpPoints ?? 100} XP</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (metrics?.xpPoints || 100) / 10)}%`, background: 'linear-gradient(90deg,#6366f1,#a855f7)' }} />
                            </div>
                            <Button variant="ghost" size="sm" onClick={fetchDashboardMetrics} className="mt-2 text-xs" leftIcon={<RefreshCw size={12} className={loading ? 'animate-spin' : ''} />}>
                                Refresh Data
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ══ STAT CARDS (LEARNING / TEACHING / FACULTY / ADMIN) ════ */}
                {isFaculty || isAdmin ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl glass animate-pulse"></div>)
                        ) : (
                            adminFacultyStatCards.map((s, i) => (
                                <div key={i} className="relative overflow-hidden glass border border-[var(--border-color)] rounded-2xl p-5 group hover:scale-[1.03] transition-all cursor-pointer">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                            style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
                                            <s.icon size={20} style={{ color: s.color }} />
                                        </div>
                                    </div>
                                    <p className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] leading-none mb-1">{s.value}</p>
                                    <p className="text-xs font-bold text-[var(--text-secondary)]">{s.label}</p>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* ─ Learning Section ─ */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen size={18} className="text-brand-400" />
                                <h2 className="text-base font-extrabold text-[var(--text-primary)]">Learning Overview</h2>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {loading ? (
                                    [1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl glass animate-pulse"></div>)
                                ) : (
                                    learningStatCards.map((s, i) => (
                                        <div key={i} className="relative overflow-hidden glass border border-[var(--border-color)] rounded-2xl p-5 group hover:scale-[1.03] transition-all cursor-pointer">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                                    style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
                                                    <s.icon size={20} style={{ color: s.color }} />
                                                </div>
                                            </div>
                                            <p className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] leading-none mb-1">{s.value}</p>
                                            <p className="text-xs font-bold text-[var(--text-secondary)]">{s.label}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* ─ Teaching Section (Visible ONLY IF user has approved MentorSkills) ─ */}
                        {isVerifiedMentor && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck size={18} className="text-emerald-400" />
                                    <h2 className="text-base font-extrabold text-[var(--text-primary)]">Teaching Overview</h2>
                                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Verified Mentor</span>
                                </div>

                                {/* Approved Teaching Skills — per-skill badges */}
                                {metrics?.approvedSkillNames && metrics.approvedSkillNames.length > 0 && (
                                    <div className="mb-4 p-4 rounded-xl glass border border-emerald-500/20 flex flex-col gap-2">
                                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Teaching Skills (Approved)</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {metrics.approvedSkillNames.map(skill => (
                                                <span key={skill}
                                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                    <CheckCircle2 size={12} /> {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {loading ? (
                                        [1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl glass animate-pulse"></div>)
                                    ) : (
                                        teachingStatCards.map((s, i) => (
                                            <div key={i} className="relative overflow-hidden glass border border-[var(--border-color)] rounded-2xl p-5 group hover:scale-[1.03] transition-all cursor-pointer">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                                        style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
                                                        <s.icon size={20} style={{ color: s.color }} />
                                                    </div>
                                                </div>
                                                <p className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] leading-none mb-1">{s.value}</p>
                                                <p className="text-xs font-bold text-[var(--text-secondary)]">{s.label}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pending mentor applications notice */}
                        {!isVerifiedMentor && metrics?.pendingSkillCount > 0 && (
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-300 text-sm">
                                <Clock size={16} className="flex-shrink-0" />
                                <span>
                                    You have <strong>{metrics.pendingSkillCount}</strong> pending mentor application{metrics.pendingSkillCount > 1 ? 's' : ''} awaiting faculty review.
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* ══ MAIN GRID ════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* ─ LEFT (2/3) ─ */}
                    <div className="xl:col-span-2 flex flex-col gap-5">

                        {/* Recent Activity */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-extrabold text-base text-[var(--text-primary)]">Recent Activity</h2>
                                <Clock size={14} className="text-[var(--text-muted)]" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {loading ? (
                                    <div className="p-4 text-xs text-[var(--text-muted)]">Loading activities...</div>
                                ) : (metrics?.recentActivities && metrics.recentActivities.length > 0) ? (
                                    metrics.recentActivities.map((act, i) => (
                                        <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-white/[0.02] border border-[var(--border-color)]">
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-500/10 border border-brand-500/20 text-brand-400">
                                                <Activity size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[0.8rem] font-semibold text-[var(--text-secondary)] leading-snug">{act.text}</p>
                                            </div>
                                            <span className="text-[0.65rem] font-bold text-[var(--text-muted)]">{act.time}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-xs text-[var(--text-muted)] italic">No recent activity logged yet.</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ─ RIGHT (1/3) ─ */}
                    <div className="flex flex-col gap-5">

                        {/* Quick Actions */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <h2 className="font-extrabold text-base text-[var(--text-primary)] mb-4">
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Explore Skills', icon: BookOpen, color: '#6366f1', nav: 'marketplace' },
                                    { label: 'Apply as Mentor', icon: ShieldCheck, color: '#10b981', nav: 'mentor' },
                                    { label: 'Book Session', icon: Calendar, color: '#a855f7', nav: 'book-session' },
                                    { label: 'Messages', icon: MessageCircle, color: '#38bdf8', nav: 'messages' },
                                ].map((a, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => navigate(a.nav)}
                                        className="group flex flex-col items-center gap-2 py-4 rounded-xl border border-[var(--border-color)] bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                                            <a.icon size={18} style={{ color: a.color }} />
                                        </div>
                                        <span className="text-[0.65rem] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">{a.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>


                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
