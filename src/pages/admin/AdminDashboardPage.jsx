import React, { useState } from 'react';
import {
    Users, UserCheck, CalendarCheck, Zap, TrendingUp, Activity,
    CheckCircle, XCircle, AlertTriangle, Bell, Shield, Database,
    Server, Clock, Download, Plus, Megaphone, BarChart2,
    PieChart, LineChart, AreaChart, Settings, Flag, FileText,
    Eye, ChevronRight, ShieldCheck, Star, Circle, Wifi, HardDrive,
    BookOpen, GraduationCap, LayoutGrid, UserPlus, Send, RefreshCw,
    Lock, BadgeCheck, MessageSquare
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';

/* ─── Dummy Data ─────────────────────────────────────────────────────── */
const ANALYTICS = [
    { label: 'Total Students', value: '14,829', change: '+8.2%', up: true, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { label: 'Active Mentors', value: '45', change: '+5.4%', up: true, icon: UserCheck, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
    { label: 'Sessions Conducted', value: '400', change: '+14.1%', up: true, icon: CalendarCheck, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Skills Available', value: '322', change: '+12 this week', up: true, icon: Zap, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'New Registrations', value: '2,341', change: 'This month', up: true, icon: UserPlus, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
    { label: 'Engagement Rate', value: '78.4%', change: '+3.1% vs last month', up: true, icon: TrendingUp, color: '#d946ef', bg: 'rgba(217,70,239,0.12)' },
];

const GROWTH_BARS = [
    { month: 'Jan', students: 55, mentors: 30 },
    { month: 'Feb', students: 62, mentors: 34 },
    { month: 'Mar', students: 70, mentors: 40 },
    { month: 'Apr', students: 78, mentors: 45 },
    { month: 'May', students: 85, mentors: 52 },
    { month: 'Jun', students: 90, mentors: 60 },
    { month: 'Jul', students: 100, mentors: 68 },
];

const TOP_SKILLS = [
    { skill: 'React / Front-End', pct: 88, color: '#6366f1' },
    { skill: 'AI & Machine Learning', pct: 74, color: '#a855f7' },
    { skill: 'UI/UX', pct: 68, color: '#38bdf8' },
    { skill: 'Python & Data', pct: 62, color: '#10b981' },
    { skill: 'Java & Spring', pct: 55, color: '#f59e0b' },
    { skill: 'Cloud / AWS', pct: 48, color: '#d946ef' },
];

const MONTHLY_SESSIONS = [35, 48, 42, 60, 55, 72, 80, 68, 90, 84, 95, 100];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MENTOR_PIE = [
    { label: 'Approved', value: 62, color: '#10b981' },
    { label: 'Pending', value: 22, color: '#f59e0b' },
    { label: 'Rejected', value: 16, color: '#ef4444' },
];

const ACTIVITY_TIMELINE = [
    { icon: UserPlus, color: '#6366f1', text: 'New student Priya Nair registered', time: '2 min ago', type: 'register' },
    { icon: ShieldCheck, color: '#10b981', text: 'Mentor Michael Chang approved by Dr. Rao', time: '15 min ago', type: 'approve' },
    { icon: CalendarCheck, color: '#a855f7', text: 'Session "Advanced React Hooks" completed', time: '1 hr ago', type: 'session' },
    { icon: Zap, color: '#f59e0b', text: 'New skill "Rust Programming" added', time: '2 hr ago', type: 'skill' },
    { icon: FileText, color: '#38bdf8', text: 'Assessment submitted by Rohan Verma', time: '3 hr ago', type: 'assess' },
    { icon: Flag, color: '#ef4444', text: 'Content flagged: Inappropriate review #4821', time: '4 hr ago', type: 'flag' },
    { icon: UserCheck, color: '#d946ef', text: 'Faculty Dr. Anita Sharma onboarded', time: '5 hr ago', type: 'faculty' },
    { icon: Download, color: '#22c55e', text: 'Monthly report exported by Admin', time: '6 hr ago', type: 'report' },
];

const MGMT_CARDS = [
    { label: 'Manage Students', icon: Users, color: '#6366f1', count: '14,829', link: 'students' },
    { label: 'Manage Mentors', icon: UserCheck, color: '#a855f7', count: '45', link: 'mentors' },
    { label: 'Manage Skills', icon: Zap, color: '#f59e0b', count: '322', link: 'skills' },
    { label: 'Manage Categories', icon: LayoutGrid, color: '#38bdf8', count: '18', link: 'categories' },
    { label: 'Manage Faculty', icon: GraduationCap, color: '#10b981', count: '47', link: 'faculty' },
    { label: 'Manage Reports', icon: BarChart2, color: '#d946ef', count: '128 new', link: 'reports' },
];

const PENDING_ACTIONS = [
    { icon: ShieldCheck, color: '#f59e0b', title: 'Mentor Applications', desc: '23 awaiting approval', badge: '23', badgeColor: '#f59e0b' },
    { icon: Flag, color: '#ef4444', title: 'Flagged Content', desc: '7 items need review', badge: '7', badgeColor: '#ef4444' },
    { icon: BadgeCheck, color: '#6366f1', title: 'Profile Verifications', desc: '15 requests pending', badge: '15', badgeColor: '#6366f1' },
    { icon: FileText, color: '#38bdf8', title: 'Student Reports', desc: '4 unresolved reports', badge: '4', badgeColor: '#38bdf8' },
];

const SYSTEM_HEALTH = [
    { label: 'Web Server', status: 'online', icon: Server, uptime: '99.98%' },
    { label: 'Database', status: 'online', icon: Database, uptime: '99.95%' },
    { label: 'API Gateway', status: 'online', icon: Wifi, uptime: '99.91%' },
    { label: 'Storage', status: 'warning', icon: HardDrive, uptime: '97.40%' },
];

const RECENT_USERS = [
    { name: 'Priya Nair', avatar: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E', role: 'Student', dept: 'CSE', status: 'active', joined: 'Jul 31, 2025' },
    { name: 'Arjun Mehta', avatar: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E', role: 'Mentor', dept: 'IT', status: 'active', joined: 'Jul 30, 2025' },
    { name: 'Dr. Anita Sharma', avatar: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E', role: 'Faculty', dept: 'Electronics', status: 'active', joined: 'Jul 29, 2025' },
    { name: 'Michael Chang', avatar: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E', role: 'Mentor', dept: 'CS / Front-End', status: 'suspended', joined: 'Jul 28, 2025' },
    { name: 'Elena Rostova', avatar: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E', role: 'Student', dept: 'CSE', status: 'active', joined: 'Jul 27, 2025' },
    { name: 'Rohan Verma', avatar: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E', role: 'Student', dept: 'Electronics', status: 'inactive', joined: 'Jul 26, 2025' },
];

const NOTIFICATIONS = [
    { icon: UserPlus, color: '#6366f1', title: 'New Registration', msg: '34 new students joined today', time: '5 min ago' },
    { icon: ShieldCheck, color: '#10b981', title: 'Mentor Approved', msg: 'Sarah Lin approved as UI/UX mentor', time: '1 hr ago' },
    { icon: AlertTriangle, color: '#f59e0b', title: 'Storage Warning', msg: 'Storage at 82% capacity', time: '3 hr ago' },
    { icon: Flag, color: '#ef4444', title: 'User Report', msg: 'Inappropriate content flagged by 3 users', time: '5 hr ago' },
    { icon: CalendarCheck, color: '#a855f7', title: 'Session Completed', msg: '128 sessions completed this week', time: '1 day ago' },
];

/* ─── Small helpers ───────────────────────────────────────────────────── */
function statusBadge(status) {
    switch (status) {
        case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
        case 'inactive': return 'bg-gray-500/10 text-gray-400 border-gray-500/25';
        case 'suspended': return 'bg-red-500/10 text-red-400 border-red-500/25';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/25';
    }
}

function roleBadge(role) {
    switch (role) {
        case 'Student': return 'bg-brand-500/10 text-brand-300 border-brand-500/20';
        case 'Mentor': return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
        case 'Faculty': return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
        default: return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
    }
}

function systemStatusDot(status) {
    return status === 'online'
        ? { dot: '#10b981', label: 'Online', cls: 'text-emerald-400' }
        : { dot: '#f59e0b', label: 'Warning', cls: 'text-amber-400' };
}

/* ─── Mini Chart: Area Sessions ───────────────────────────────────────── */
function AreaSessionChart() {
    const max = 100;
    const W = 400, H = 90;
    const pts = MONTHLY_SESSIONS.map((v, i) => ({
        x: (i / (MONTHLY_SESSIONS.length - 1)) * W,
        y: H - (v / max) * H,
    }));
    const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
    const area = `M${pts[0].x},${H} ` + pts.map(p => `L${p.x},${p.y}`).join(' ') + ` L${pts[pts.length - 1].x},${H} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }}>
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#areaGrad)" />
            <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#6366f1" stroke="var(--bg-elevated)" strokeWidth="2" />
            ))}
        </svg>
    );
}

/* ─── Mini Donut ──────────────────────────────────────────────────────── */
function DonutChart() {
    const total = MENTOR_PIE.reduce((a, b) => a + b.value, 0);
    let cumulative = 0;
    const R = 44, CX = 56, CY = 56, STROKE = 14;
    const circumference = 2 * Math.PI * R;

    return (
        <div className="flex items-center gap-6">
            <svg width="112" height="112" viewBox="0 0 112 112" className="flex-shrink-0">
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={STROKE} />
                {MENTOR_PIE.map((seg, i) => {
                    const dashLen = (seg.value / total) * circumference;
                    const offset = circumference - cumulative * circumference / total;
                    cumulative += seg.value;
                    return (
                        <circle key={i} cx={CX} cy={CY} r={R}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={STROKE}
                            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${CX} ${CY})`}
                        />
                    );
                })}
                <text x={CX} y={CY + 5} textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="800">
                    {total}%
                </text>
            </svg>
            <div className="flex flex-col gap-2">
                {MENTOR_PIE.map(seg => (
                    <div key={seg.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">{seg.label}</span>
                        <span className="ml-auto text-xs font-bold text-[var(--text-primary)]">{seg.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Growth Bar Chart ────────────────────────────────────────────────── */
function GrowthBars() {
    const max = 100;
    return (
        <div className="flex items-end gap-2 h-24 w-full">
            {GROWTH_BARS.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5" style={{ height: 72 }}>
                        <div className="w-full rounded-t-lg transition-all duration-700"
                            style={{ height: `${(d.students / max) * 72}px`, background: 'linear-gradient(180deg, #6366f1, #818cf8)' }} />
                    </div>
                    <span className="text-[0.6rem] font-bold text-[var(--text-muted)]">{d.month}</span>
                </div>
            ))}
        </div>
    );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementMsg, setAnnouncementMsg] = useState('');
    const [announcementAudience, setAnnouncementAudience] = useState('all');
    const [published, setPublished] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const handlePublish = () => {
        if (announcementTitle && announcementMsg) {
            setPublished(true);
            setTimeout(() => {
                setPublished(false);
                setAnnouncementTitle('');
                setAnnouncementMsg('');
            }, 3000);
        }
    };

    return (
        <AppLayout pageTitle="Admin Dashboard" activeNavId="admin">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-7 pb-14" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <Shield size={16} className="text-white" />
                            </div>
                            <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Super Admin</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] leading-tight">Admin Dashboard</h1>
                        <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Monitor and manage the entire SkillSync platform.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <button id="admin-refresh" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                            <RefreshCw size={13} /> Refresh
                        </button>
                        <button id="admin-export" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600/15 border border-brand-500/30 text-brand-400 text-xs font-bold hover:bg-brand-600 hover:text-white transition-all">
                            <Download size={13} /> Export Reports
                        </button>
                        <button id="admin-settings" className="w-9 h-9 rounded-xl glass border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-brand-400 transition-all">
                            <Settings size={16} />
                        </button>
                    </div>
                </div>

                {/* ── Tab Navigation ── */}
                <div className="flex gap-1 p-1 glass rounded-xl border border-[var(--border-color)] w-fit">
                    {['overview', 'users', 'analytics', 'system'].map(tab => (
                        <button key={tab} id={`admin-tab-${tab}`}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${activeTab === tab
                                ? 'bg-brand-600 text-white shadow-md'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Analytics Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                    {ANALYTICS.map((a, i) => (
                        <div key={i} className="relative overflow-hidden rounded-2xl glass border border-[var(--border-color)] p-5 group hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-2xl"
                                style={{ background: a.color }} />
                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">{a.label}</p>
                                    <p className="text-3xl font-extrabold text-[var(--text-primary)] leading-none mb-1.5">{a.value}</p>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp size={11} style={{ color: a.color }} />
                                        <p className="text-[0.7rem] font-semibold" style={{ color: a.color }}>{a.change}</p>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: a.bg, border: `1px solid ${a.color}30` }}>
                                    <a.icon size={22} style={{ color: a.color }} />
                                </div>
                            </div>
                            <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                                <div className="h-full rounded-full opacity-70"
                                    style={{ width: `${60 + i * 7}%`, background: `linear-gradient(90deg, ${a.color}55, ${a.color})` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Charts Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Student Growth */}
                    <div className="lg:col-span-2 glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-base">Student Growth</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">Monthly registrations trend</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#6366f1' }} />
                                    <span className="text-[0.65rem] font-bold text-[var(--text-muted)]">Students</span>
                                </div>
                                <LineChart size={14} className="text-[var(--text-muted)]" />
                            </div>
                        </div>
                        <GrowthBars />
                        <div className="mt-3 flex items-center justify-between">
                            {GROWTH_BARS.map(d => (
                                <span key={d.month} className="flex-1 text-center text-[0.6rem] text-[var(--text-muted)] font-bold">{d.month}</span>
                            ))}
                        </div>
                    </div>

                    {/* Mentor Activity Donut */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-base">Mentor Activity</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">Approval distribution</p>
                            </div>
                            <PieChart size={14} className="text-[var(--text-muted)]" />
                        </div>
                        <DonutChart />
                    </div>
                </div>

                {/* Top Skills + Sessions Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Top Skills Bar */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-base">Top Skills</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">By student enrollment</p>
                            </div>
                            <BarChart2 size={14} className="text-[var(--text-muted)]" />
                        </div>
                        <div className="flex flex-col gap-3">
                            {TOP_SKILLS.map((s, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-[var(--text-secondary)]">{s.skill}</span>
                                        <span className="text-xs font-extrabold" style={{ color: s.color }}>{s.pct}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}80, ${s.color})` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Sessions Area */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-base">Monthly Sessions</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">Sessions conducted per month</p>
                            </div>
                            <AreaChart size={14} className="text-[var(--text-muted)]" />
                        </div>
                        <AreaSessionChart />
                        <div className="flex justify-between mt-2">
                            {MONTHS_SHORT.map(m => (
                                <span key={m} className="text-[0.55rem] font-bold text-[var(--text-muted)]">{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Platform Management + Pending Actions ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    {/* Management Cards */}
                    <div className="xl:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-extrabold text-base text-[var(--text-primary)]">Platform Management</h2>
                            <span className="text-xs text-[var(--text-muted)] font-semibold">6 modules</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {MGMT_CARDS.map((c, i) => (
                                <button key={i} id={`mgmt-${c.link}`}
                                    className="group flex flex-col gap-3 p-4 glass border border-[var(--border-color)] rounded-2xl text-left hover:scale-[1.03] hover:border-opacity-60 transition-all duration-200">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: `${c.color}18`, border: `1px solid ${c.color}30` }}>
                                        <c.icon size={20} style={{ color: c.color }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">{c.label}</p>
                                        <p className="text-[0.68rem] font-semibold mt-0.5" style={{ color: c.color }}>{c.count}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-1 transition-all mt-auto self-end" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pending Actions */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-extrabold text-base text-[var(--text-primary)]">Pending Actions</h2>
                            <span className="text-[0.6rem] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-lg">49 total</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {PENDING_ACTIONS.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-[var(--border-color)] rounded-xl hover:bg-white/[0.04] cursor-pointer transition-all group">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                                        <p.icon size={16} style={{ color: p.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">{p.title}</p>
                                        <p className="text-[0.68rem] text-[var(--text-muted)] font-medium">{p.desc}</p>
                                    </div>
                                    <span className="text-[0.6rem] font-extrabold px-2 py-0.5 rounded-lg flex-shrink-0"
                                        style={{ background: `${p.badgeColor}15`, color: p.badgeColor, border: `1px solid ${p.badgeColor}25` }}>
                                        {p.badge}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── System Health + Quick Actions ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* System Health */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-extrabold text-base text-[var(--text-primary)]">System Health</h2>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[0.65rem] font-bold text-emerald-400">All Systems Operational</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 mb-4">
                            {SYSTEM_HEALTH.map((s, i) => {
                                const st = systemStatusDot(s.status);
                                return (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-[var(--border-color)] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{ background: `${st.dot}18`, border: `1px solid ${st.dot}25` }}>
                                                <s.icon size={15} style={{ color: st.dot }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-primary)]">{s.label}</p>
                                                <p className="text-[0.65rem] text-[var(--text-muted)] font-medium">Uptime: {s.uptime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full"
                                                style={{ background: st.dot, boxShadow: s.status === 'online' ? `0 0 6px ${st.dot}` : 'none' }} />
                                            <span className={`text-[0.65rem] font-bold ${st.cls}`}>{st.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white/[0.02] border border-[var(--border-color)] rounded-xl">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Active Users</p>
                                <p className="text-xl font-extrabold text-[var(--text-primary)] mt-1">3,412</p>
                            </div>
                            <div className="p-3 bg-white/[0.02] border border-[var(--border-color)] rounded-xl">
                                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Last Backup</p>
                                <p className="text-sm font-bold text-[var(--text-primary)] mt-1">Today 06:00 AM</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <h2 className="font-extrabold text-base text-[var(--text-primary)] mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[
                                { label: 'Add New Skill', icon: Plus, color: '#6366f1' },
                                { label: 'Add Faculty', icon: GraduationCap, color: '#a855f7' },
                                { label: 'Export Reports', icon: Download, color: '#10b981' },
                                { label: 'Send Announcement', icon: Megaphone, color: '#f59e0b' },
                                { label: 'Lock Account', icon: Lock, color: '#ef4444' },
                                { label: 'View Logs', icon: FileText, color: '#38bdf8' },
                            ].map((q, i) => (
                                <button key={i} id={`quick-action-${i}`}
                                    className="flex items-center gap-2.5 p-3 bg-white/[0.02] border border-[var(--border-color)] rounded-xl hover:bg-white/[0.05] hover:scale-[1.02] transition-all group text-left">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${q.color}15`, border: `1px solid ${q.color}25` }}>
                                        <q.icon size={13} style={{ color: q.color }} />
                                    </div>
                                    <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{q.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Announcement Panel ── */}
                <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Megaphone size={17} className="text-amber-400" />
                        <h2 className="font-extrabold text-base text-[var(--text-primary)]">Create Announcement</h2>
                    </div>
                    {published ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3 animate-scale-in">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)' }}>
                                <CheckCircle size={28} className="text-emerald-400" />
                            </div>
                            <p className="font-bold text-emerald-400 text-sm">Announcement Published Successfully!</p>
                            <p className="text-xs text-[var(--text-muted)]">Notification sent to all selected users.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Announcement Title</label>
                                    <input
                                        id="announcement-title"
                                        value={announcementTitle}
                                        onChange={e => setAnnouncementTitle(e.target.value)}
                                        placeholder="e.g. Platform Maintenance on Aug 1st..."
                                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Target Audience</label>
                                    <select
                                        id="announcement-audience"
                                        value={announcementAudience}
                                        onChange={e => setAnnouncementAudience(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="students">Students Only</option>
                                        <option value="mentors">Mentors Only</option>
                                        <option value="faculty">Faculty Only</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex-1 flex flex-col">
                                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Message</label>
                                    <textarea
                                        id="announcement-message"
                                        value={announcementMsg}
                                        onChange={e => setAnnouncementMsg(e.target.value)}
                                        placeholder="Write your announcement message here..."
                                        className="flex-1 min-h-[100px] px-4 py-3 bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all resize-none"
                                    />
                                </div>
                                <button
                                    id="publish-announcement"
                                    onClick={handlePublish}
                                    disabled={!announcementTitle || !announcementMsg}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                                    <Send size={14} /> Publish Announcement
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Recent Users Table ── */}
                <div className="glass border border-[var(--border-color)] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-white/[0.01]">
                        <div>
                            <h2 className="font-extrabold text-base text-[var(--text-primary)]">Recent Users</h2>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">Latest registrations across the platform</p>
                        </div>
                        <button id="view-all-users" className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                            View All <ChevronRight size={13} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ minWidth: '700px' }}>
                            <thead>
                                <tr className="border-b border-[var(--border-color)] bg-white/[0.01]">
                                    {['User', 'Role', 'Department', 'Status', 'Joined', 'Action'].map(h => (
                                        <th key={h} className={`px-5 py-3 text-[0.62rem] font-bold uppercase tracking-widest text-[var(--text-muted)] ${h === 'Action' ? 'text-right' : 'text-left'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {RECENT_USERS.map((u, i) => (
                                    <tr key={i} className="hover:bg-white/[0.018] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <img src={u.avatar} alt={u.name}
                                                    className="w-9 h-9 rounded-full object-cover border-2"
                                                    style={{ borderColor: 'rgba(99,102,241,0.3)' }} />
                                                <span className="font-bold text-sm text-[var(--text-primary)]">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-lg border ${roleBadge(u.role)}`}>{u.role}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs text-[var(--text-secondary)] font-medium">{u.dept}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`flex items-center gap-1.5 w-fit text-[0.65rem] font-bold px-2.5 py-1 rounded-lg border ${statusBadge(u.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full"
                                                    style={{ background: u.status === 'active' ? '#10b981' : u.status === 'suspended' ? '#ef4444' : '#6b7280' }} />
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs text-[var(--text-muted)] font-medium">{u.joined}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button id={`user-view-${i}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.65rem] font-bold border border-brand-500/25 bg-brand-500/10 text-brand-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all">
                                                <Eye size={11} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Activity Timeline + Notifications ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Activity Timeline */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-extrabold text-base text-[var(--text-primary)]">Recent Activity</h2>
                            <Activity size={15} className="text-[var(--text-muted)]" />
                        </div>
                        <div className="flex flex-col">
                            {ACTIVITY_TIMELINE.map((item, i) => (
                                <div key={i} className="flex gap-3 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all group-hover:scale-110"
                                            style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                                            <item.icon size={13} style={{ color: item.color }} />
                                        </div>
                                        {i < ACTIVITY_TIMELINE.length - 1 && (
                                            <div className="w-px flex-1 my-1.5 bg-[var(--border-color)]" />
                                        )}
                                    </div>
                                    <div className="pb-4 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--text-secondary)] leading-snug">{item.text}</p>
                                        <p className="text-[0.65rem] font-bold text-[var(--text-muted)] mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications Panel */}
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-extrabold text-base text-[var(--text-primary)]">Notifications</h2>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[0.6rem] font-bold bg-brand-500/15 text-brand-400 border border-brand-500/25 rounded-lg">{NOTIFICATIONS.length} new</span>
                                <Bell size={14} className="text-[var(--text-muted)]" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {NOTIFICATIONS.map((n, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.02] border border-[var(--border-color)] rounded-xl hover:bg-white/[0.04] cursor-pointer transition-all group">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${n.color}15`, border: `1px solid ${n.color}25` }}>
                                        <n.icon size={15} style={{ color: n.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">{n.title}</p>
                                        <p className="text-[0.68rem] text-[var(--text-muted)] font-medium mt-0.5 leading-snug">{n.msg}</p>
                                        <p className="text-[0.6rem] text-[var(--text-muted)] mt-1">{n.time}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex-shrink-0 mt-1" />
                                </div>
                            ))}
                        </div>
                        <button id="mark-all-read" className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all">
                            Mark all as read
                        </button>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
