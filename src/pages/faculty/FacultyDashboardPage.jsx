import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Users, FileText, CheckCircle, XCircle, Search,
    Eye, CheckCircle2, AlertTriangle, FileCheck, FileDown,
    X, AlertCircle, Download, Star, RotateCcw, ShieldCheck,
    Bell, TrendingUp, Award, Calendar, BookOpen, Layers,
    ChevronDown, GraduationCap, RefreshCw
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { Card, CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const DEPARTMENTS = ['All Departments', 'CSE', 'IT', 'AIDS', 'ECE', 'EEE', 'MECH', 'CIVIL'];

function statusStyle(status) {
    switch (status) {
        case 'pending': return { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: '#f59e0b' };
        case 'approved': return { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: '#10b981' };
        case 'rejected': return { badge: 'bg-red-500/10 text-red-400 border-red-500/30', dot: '#ef4444' };
        default: return { badge: 'bg-gray-500/10 text-gray-400 border-gray-500/30', dot: '#6b7280' };
    }
}

export default function FacultyDashboardPage() {
    const { token } = useAuth();
    const { toast } = useToast();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All Departments');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch mentor applications from backend
    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/mentor/applications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setApplications(data.data);
            } else {
                toast({
                    variant: 'error',
                    title: 'Error Loading Applications',
                    message: data.message || 'Failed to fetch mentor applications.',
                });
            }
        } catch (err) {
            console.error('Fetch mentor applications error:', err);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to connect to backend server.',
            });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Handle Approve / Reject Actions
    const handleApplicationAction = async (appId, action) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/mentor/approve/${appId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });

            const data = await res.json();

            if (data.success) {
                toast({
                    variant: action === 'approve' ? 'success' : 'info',
                    title: action === 'approve' ? 'Mentor Approved 🎉' : 'Application Rejected',
                    message: data.message,
                });
                setSelectedApp(null);
                fetchApplications();
            } else {
                toast({
                    variant: 'error',
                    title: 'Action Failed',
                    message: data.message || 'Could not update application status.',
                });
            }
        } catch (err) {
            console.error('Approve/Reject error:', err);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to process request.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Filter applications
    const filteredApps = useMemo(() => applications.filter(app => {
        const student = app.student || {};
        const q = search.toLowerCase();
        const matchSearch = !q ||
            student.fullName?.toLowerCase().includes(q) ||
            student.registerNumber?.toLowerCase().includes(q) ||
            student.department?.toLowerCase().includes(q);

        const matchDept = deptFilter === 'All Departments' || student.department === deptFilter;
        const matchStatus = statusFilter === 'All' || app.status === statusFilter.toLowerCase();

        return matchSearch && matchDept && matchStatus;
    }), [applications, search, deptFilter, statusFilter]);

    // Calculate Summary Stats
    const stats = useMemo(() => {
        const total = applications.length;
        const pending = applications.filter(a => a.status === 'pending').length;
        const approved = applications.filter(a => a.status === 'approved').length;
        const rejected = applications.filter(a => a.status === 'rejected').length;
        return { total, pending, approved, rejected };
    }, [applications]);

    return (
        <AppLayout pageTitle="Mentor Verification" activeNavId="faculty">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-8 pb-12" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <GraduationCap size={16} className="text-white" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Faculty Panel</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] leading-tight">
                            Mentor Verification
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">
                            Review assessment scores and verify student mentor applications.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={fetchApplications} leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}>
                            Refresh
                        </Button>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-amber-500/30 text-amber-400 text-sm font-bold">
                            <Bell size={15} />
                            <span>{stats.pending} Pending Review{stats.pending !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
                    {[
                        { label: 'Total Applications', value: stats.total, color: '#3b82f6', icon: Users },
                        { label: 'Pending Verification', value: stats.pending, color: '#f59e0b', icon: FileText },
                        { label: 'Approved Mentors', value: stats.approved, color: '#10b981', icon: CheckCircle },
                        { label: 'Rejected Applications', value: stats.rejected, color: '#ef4444', icon: XCircle },
                    ].map((stat, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-2xl glass border border-[var(--border-color)] p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">{stat.label}</p>
                                    <p className="text-3xl font-extrabold text-[var(--text-primary)] leading-none mb-1">{stat.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}35` }}>
                                    <stat.icon size={22} style={{ color: stat.color }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="glass rounded-2xl border border-[var(--border-color)] p-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-0">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={16} className="text-[var(--text-muted)]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by student name, department, or register number..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-500 transition-all"
                            />
                        </div>
                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <select
                                    value={deptFilter}
                                    onChange={e => setDeptFilter(e.target.value)}
                                    className="appearance-none bg-white/[0.03] border border-[var(--border-color)] rounded-xl pl-4 pr-8 py-2.5 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-brand-500 cursor-pointer min-w-[160px]"
                                >
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                            </div>

                            <div className="flex bg-white/[0.03] border border-[var(--border-color)] rounded-xl overflow-hidden">
                                {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className={`px-3.5 py-2 text-xs font-bold transition-all ${statusFilter === s
                                            ? 'bg-brand-600 text-white shadow-md'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="glass rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-white/[0.01]">
                        <div>
                            <h2 className="font-bold text-base text-[var(--text-primary)]">Mentor Applications</h2>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{filteredApps.length} application{filteredApps.length !== 1 ? 's' : ''} found</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ minWidth: '800px' }}>
                            <thead>
                                <tr className="bg-white/[0.015] border-b border-[var(--border-color)]">
                                    <th className="px-6 py-3.5 text-left text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Student Name</th>
                                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Register Number</th>
                                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Department</th>
                                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Assessment Score</th>
                                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Date Applied</th>
                                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                                    <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {filteredApps.map(app => {
                                    const student = app.student || {};
                                    const st = statusStyle(app.status);
                                    const scorePct = ((app.score / (app.totalQuestions || 20)) * 100).toFixed(0);
                                    const scoreColor = scorePct >= 80 ? '#10b981' : scorePct >= 70 ? '#f59e0b' : '#ef4444';
                                    const formattedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                                    return (
                                        <tr key={app._id} className="group hover:bg-white/[0.018] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                                                    {student.fullName || 'Student User'}
                                                </div>
                                                <div className="text-[0.7rem] text-[var(--text-muted)] mt-0.5">{student.email}</div>
                                            </td>

                                            <td className="px-4 py-4 font-mono text-xs font-bold text-[var(--text-primary)]">
                                                {student.registerNumber || 'N/A'}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-semibold text-[var(--text-secondary)]">
                                                {student.department || 'CSE'}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${scorePct}%`, background: scoreColor }} />
                                                    </div>
                                                    <span className="text-xs font-extrabold" style={{ color: scoreColor }}>
                                                        {app.score}/{app.totalQuestions || 20} ({scorePct}%)
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-medium">
                                                {formattedDate}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-lg border ${st.badge}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                                                    {app.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {app.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => handleApplicationAction(app._id, 'approve')}
                                                            disabled={isProcessing}
                                                            leftIcon={<ShieldCheck size={14} />}
                                                            style={{ padding: '0.35rem 0.65rem' }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleApplicationAction(app._id, 'reject')}
                                                            disabled={isProcessing}
                                                            leftIcon={<XCircle size={14} />}
                                                            style={{ padding: '0.35rem 0.65rem' }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-[var(--text-muted)] italic capitalize">
                                                        {app.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredApps.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[var(--border-color)] flex items-center justify-center">
                                    <Search size={24} className="text-[var(--text-muted)]" />
                                </div>
                                <p className="font-semibold text-[var(--text-secondary)]">No mentor applications found</p>
                                <p className="text-xs text-[var(--text-muted)]">When students complete the 20 MCQ assessment with ≥70% score, their applications will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
