import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Search, Trophy, Star, Zap, Award, TrendingUp, Users,
    CalendarCheck, Medal, Crown, ChevronUp, ChevronDown,
    Flame, Target, Shield, BookOpen, RefreshCw
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const DEPARTMENTS = ['All Departments', 'CSE', 'IT', 'AIDS', 'ECE', 'EEE', 'MECH', 'CIVIL'];

const BADGE_STYLE = {
    'Coding Expert': { color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)' },
    'Placement Champion': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
    'Top Mentor': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
    'Community Helper': { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)' },
    'Verified Mentor': { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    'Top Learner': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
    'Rising Learner': { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
    'Beginner': { color: '#cd7f32', bg: 'rgba(205,127,50,0.12)', border: 'rgba(205,127,50,0.3)' },
};

const RANK_META = {
    1: { medal: '🥇', ring: 'rgba(245,158,11,0.5)', glow: 'rgba(245,158,11,0.3)', height: 'h-52' },
    2: { medal: '🥈', ring: 'rgba(156,163,175,0.5)', glow: 'rgba(156,163,175,0.2)', height: 'h-44' },
    3: { medal: '🥉', ring: 'rgba(205,127,50,0.5)', glow: 'rgba(205,127,50,0.2)', height: 'h-36' },
};

function RankIcon({ rank }) {
    if (rank === 1) return <Crown size={14} className="text-amber-400" />;
    if (rank === 2) return <Medal size={14} className="text-gray-400" />;
    if (rank === 3) return <Medal size={14} style={{ color: '#cd7f32' }} />;
    return <span className="text-xs font-extrabold text-[var(--text-muted)]">#{rank}</span>;
}

function PodiumCard({ user, position }) {
    if (!user) return null;
    const meta = RANK_META[position];
    const badgeS = BADGE_STYLE[user.badge] || BADGE_STYLE['Beginner'];
    const isFirst = position === 1;

    return (
        <div className={`flex flex-col items-center ${isFirst ? 'order-2 sm:order-none' : ''}`}>
            <div className="relative mb-3">
                {isFirst && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">👑</div>}
                <div
                    className="rounded-2xl flex items-center justify-center font-extrabold text-white text-xl border-4 transition-transform hover:scale-105"
                    style={{
                        width: isFirst ? 88 : 72,
                        height: isFirst ? 88 : 72,
                        borderColor: meta.ring,
                        boxShadow: `0 0 24px ${meta.glow}`,
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)'
                    }}
                >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 text-lg">{meta.medal}</div>
            </div>

            <div className="text-center mb-3">
                <p className={`font-extrabold text-[var(--text-primary)] ${isFirst ? 'text-base' : 'text-sm'}`}>{user.name}</p>
                <p className="text-[0.65rem] text-[var(--text-muted)] mt-0.5 font-medium">{user.dept}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-lg"
                        style={{ background: badgeS.bg, color: badgeS.color, border: `1px solid ${badgeS.border}` }}>
                        {user.badge}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
                <div className="text-center">
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">XP</p>
                    <p className={`font-extrabold ${isFirst ? 'text-lg text-amber-400' : 'text-base text-[var(--text-primary)]'}`}>
                        {user.xp?.toLocaleString()}
                    </p>
                </div>
                <div className="w-px h-8 bg-[var(--border-color)]" />
                <div className="text-center">
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Lvl</p>
                    <p className={`font-extrabold ${isFirst ? 'text-lg text-brand-400' : 'text-base text-[var(--text-primary)]'}`}>
                        {user.level}
                    </p>
                </div>
            </div>

            <div className={`w-full rounded-t-2xl flex items-center justify-center ${meta.height}`}
                style={{
                    background: isFirst
                        ? 'linear-gradient(180deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))'
                        : position === 2
                            ? 'linear-gradient(180deg, rgba(156,163,175,0.15), rgba(156,163,175,0.03))'
                            : 'linear-gradient(180deg, rgba(205,127,50,0.15), rgba(205,127,50,0.03))',
                    border: `1px solid ${meta.ring}`,
                    borderBottom: 'none',
                }}>
                <span className="text-3xl font-black opacity-30">#{position}</span>
            </div>
        </div>
    );
}

export default function LeaderboardPage() {
    const { token, user: currentUser } = useAuth();
    const { toast } = useToast();

    // State
    const [leaderboardUsers, setLeaderboardUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('Overall');
    const [timeFilter, setTimeFilter] = useState('All Time');
    const [deptFilter, setDeptFilter] = useState('All Departments');
    const [search, setSearch] = useState('');
    const [sortCol, setSortCol] = useState('xp');
    const [sortDir, setSortDir] = useState('desc');

    const [userXP, setUserXP] = useState(null);
    const [achievementsData, setAchievementsData] = useState(null);

    // Fetch Leaderboard data from backend
    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (roleFilter !== 'Overall') queryParams.append('role', roleFilter);
            if (timeFilter !== 'All Time') queryParams.append('time', timeFilter);
            if (deptFilter !== 'All Departments') queryParams.append('department', deptFilter);
            if (search) queryParams.append('search', search);

            const res = await fetch(`${API_BASE_URL}/leaderboard?${queryParams.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {
                setLeaderboardUsers(data.data);
            } else {
                toast({ variant: 'error', title: 'Error Loading Leaderboard', message: data.message });
            }
        } catch (err) {
            console.error('Fetch leaderboard error:', err);
            toast({ variant: 'error', title: 'Network Error', message: 'Failed to fetch leaderboard metrics.' });
        } finally {
            setLoading(false);
        }
    }, [token, roleFilter, timeFilter, deptFilter, search, toast]);

    // Fetch User XP status
    const fetchUserXP = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/xp`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setUserXP(data.data);
            }
        } catch (err) {
            console.error('Fetch user XP error:', err);
        }
    }, [token]);

    // Fetch Achievements
    const fetchAchievements = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/achievements`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setAchievementsData(data.data);
            }
        } catch (err) {
            console.error('Fetch achievements error:', err);
        }
    }, [token]);

    useEffect(() => {
        fetchLeaderboard();
        fetchUserXP();
        fetchAchievements();
    }, [fetchLeaderboard, fetchUserXP, fetchAchievements]);

    // Filter and Sort
    const filtered = useMemo(() => {
        let data = [...leaderboardUsers];
        if (timeFilter === 'Monthly') {
            data.sort((a, b) => (sortDir === 'desc' ? b.monthly_xp - a.monthly_xp : a.monthly_xp - b.monthly_xp));
        } else {
            data.sort((a, b) => sortDir === 'desc' ? b[sortCol] - a[sortCol] : a[sortCol] - b[sortCol]);
        }
        return data.map((u, i) => ({ ...u, rank: i + 1 }));
    }, [leaderboardUsers, timeFilter, sortCol, sortDir]);

    const top3 = filtered.slice(0, 3);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortCol(col); setSortDir('desc'); }
    };

    const SortBtn = ({ col, children }) => (
        <button onClick={() => toggleSort(col)} className="flex items-center gap-1 group text-left hover:text-[var(--text-primary)] transition-colors">
            {children}
            <span className="opacity-40 group-hover:opacity-80">
                {sortCol === col ? (sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : <ChevronDown size={11} />}
            </span>
        </button>
    );

    const myXp = userXP?.xp || 100;
    const myLevel = userXP?.level || 1;
    const myNextXp = userXP?.nextLevelXp || 200;
    const myBadge = userXP?.badge || 'Beginner';
    const xpPct = Math.min(100, Math.round((myXp / myNextXp) * 100));

    return (
        <AppLayout pageTitle="Leaderboard" activeNavId="leaderboard">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-7 pb-14" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                                <Trophy size={16} className="text-white" />
                            </div>
                            <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Rankings</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] leading-tight">Leaderboard</h1>
                        <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">
                            Celebrate top learners and verified mentors on SkillSync.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button onClick={fetchLeaderboard} className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-white">
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-4 py-2 rounded-xl">
                            <Flame size={14} /> Season Active
                        </div>
                    </div>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Leaderboard Users', value: leaderboardUsers.length, icon: Users, color: '#6366f1' },
                        { label: 'My Current Rank', value: `#${userXP?.rank || 1}`, icon: Trophy, color: '#f59e0b' },
                        { label: 'My Current Level', value: `Level ${myLevel}`, icon: Zap, color: '#10b981' },
                        { label: 'Current Badge', value: myBadge, icon: Award, color: '#a855f7' },
                    ].map((s, i) => (
                        <div key={i} className="relative overflow-hidden glass border border-[var(--border-color)] rounded-2xl p-4">
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                                    <s.icon size={18} style={{ color: s.color }} />
                                </div>
                                <div>
                                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">{s.label}</p>
                                    <p className="text-xl font-extrabold text-[var(--text-primary)] leading-none mt-0.5">{s.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Podium (Top 3) ── */}
                {top3.length > 0 && (
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <Trophy size={18} className="text-amber-400" />
                                <h2 className="font-extrabold text-lg text-[var(--text-primary)]">Top Performers</h2>
                                <Trophy size={18} className="text-amber-400" />
                            </div>

                            <div className="flex items-end justify-center gap-4 sm:gap-8 max-w-2xl mx-auto">
                                {top3[1] && <div className="flex-1 max-w-[160px]"><PodiumCard user={top3[1]} position={2} /></div>}
                                {top3[0] && <div className="flex-1 max-w-[200px]"><PodiumCard user={top3[0]} position={1} /></div>}
                                {top3[2] && <div className="flex-1 max-w-[160px]"><PodiumCard user={top3[2]} position={3} /></div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Main Content: Table + Sidebar ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* ─ Left: Full Table ─ */}
                    <div className="xl:col-span-2 flex flex-col gap-4">

                        {/* Filters + Search */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex bg-white/[0.03] border border-[var(--border-color)] rounded-xl overflow-hidden flex-shrink-0">
                                {['Overall', 'Students', 'Mentors'].map(f => (
                                    <button key={f}
                                        onClick={() => setRoleFilter(f)}
                                        className={`px-4 py-2.5 text-xs font-bold transition-all ${roleFilter === f ? 'bg-brand-600 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>

                            <select
                                value={deptFilter}
                                onChange={e => setDeptFilter(e.target.value)}
                                className="bg-white/[0.03] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                            >
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>

                            <div className="flex bg-white/[0.03] border border-[var(--border-color)] rounded-xl overflow-hidden flex-shrink-0">
                                {['Monthly', 'All Time'].map(f => (
                                    <button key={f}
                                        onClick={() => setTimeFilter(f)}
                                        className={`px-4 py-2.5 text-xs font-bold transition-all ${timeFilter === f ? 'bg-amber-500 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>

                            <div className="relative flex-1 min-w-0">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search name..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full" style={{ minWidth: '640px' }}>
                                    <thead>
                                        <tr className="border-b border-[var(--border-color)] bg-white/[0.015]">
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] w-12">Rank</th>
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">User</th>
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Role</th>
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                                <SortBtn col={timeFilter === 'Monthly' ? 'monthly_xp' : 'xp'}>XP</SortBtn>
                                            </th>
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                                <SortBtn col="level">Lvl</SortBtn>
                                            </th>
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                                <SortBtn col="sessions">Sessions</SortBtn>
                                            </th>
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                                <SortBtn col="rating">Rating</SortBtn>
                                            </th>
                                            <th className="px-4 py-3 text-left text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Badge</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-8 text-center text-xs text-[var(--text-muted)]">
                                                    Loading leaderboard data...
                                                </td>
                                            </tr>
                                        ) : filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[var(--border-color)] flex items-center justify-center">
                                                            <Trophy size={24} className="text-[var(--text-muted)]" />
                                                        </div>
                                                        <p className="font-bold text-[var(--text-secondary)]">No rankings found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((u) => {
                                                const badgeS = BADGE_STYLE[u.badge] || BADGE_STYLE['Beginner'];
                                                const isTop3 = u.rank <= 3;
                                                const isMe = u._id === currentUser?._id;

                                                return (
                                                    <tr key={u._id || u.rank} className={`transition-colors ${isMe ? 'bg-brand-600/10' : 'hover:bg-white/[0.018]'}`}>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                                                                <RankIcon rank={u.rank} />
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center border">
                                                                    {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="font-bold text-sm text-[var(--text-primary)]">{u.name}</span>
                                                                        {isMe && <span className="text-[0.55rem] font-extrabold bg-brand-600 text-white px-1.5 py-0.5 rounded-md">YOU</span>}
                                                                    </div>
                                                                    <p className="text-[0.65rem] text-[var(--text-muted)] font-medium">{u.dept}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <span className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-lg border ${u.role === 'Mentor' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' : 'bg-brand-500/10 text-brand-300 border-brand-500/20'}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <Zap size={12} className="text-amber-400" />
                                                                <span className="text-sm font-extrabold text-amber-400">
                                                                    {(timeFilter === 'Monthly' ? u.monthly_xp : u.xp)?.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <span className="text-sm font-bold text-[var(--text-primary)]">Lv.{u.level}</span>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <span className="text-sm font-semibold text-[var(--text-secondary)]">{u.sessions}</span>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-1">
                                                                <Star size={12} className="text-amber-400" fill="#f59e0b" />
                                                                <span className="text-sm font-bold text-[var(--text-primary)]">{u.rating}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <span className="text-[0.62rem] font-bold px-2.5 py-1 rounded-lg"
                                                                style={{ background: badgeS.bg, color: badgeS.color, border: `1px solid ${badgeS.border}` }}>
                                                                {u.badge}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ─ Right: Sidebar Cards ─ */}
                    <div className="flex flex-col gap-5">

                        {/* My XP Progress */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={15} className="text-brand-400" />
                                <h3 className="font-extrabold text-sm text-[var(--text-primary)]">My XP Progress</h3>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-extrabold text-base"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                                    {myLevel}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text-primary)]">{currentUser?.fullName || 'User'}</p>
                                    <p className="text-[0.65rem] text-[var(--text-muted)] font-medium">Level {myLevel} · {myBadge}</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-wide">XP to next level</span>
                                    <span className="text-[0.65rem] font-extrabold text-brand-400">{myXp.toLocaleString()} / {myNextXp.toLocaleString()}</span>
                                </div>
                                <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                                </div>
                                <p className="text-[0.62rem] text-[var(--text-muted)] mt-1.5 font-medium">{xpPct}% to Level {myLevel + 1}</p>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Award size={15} className="text-amber-400" />
                                <h3 className="font-extrabold text-sm text-[var(--text-primary)]">Achievements</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                {(achievementsData?.achievements || []).map((a, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-white/[0.02]">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}>
                                            <Trophy size={18} style={{ color: a.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[0.68rem] font-bold text-[var(--text-primary)] leading-tight">{a.title}</p>
                                            <p className="text-[0.6rem] text-[var(--text-muted)] font-medium mt-0.5">{a.name}</p>
                                            <p className="text-[0.58rem] font-semibold mt-0.5" style={{ color: a.color }}>{a.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
