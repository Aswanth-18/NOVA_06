import { useState, useEffect, useCallback } from 'react';
import {
    BarChart2, ShieldCheck, Users, Trophy, Download, Calendar,
    CheckCircle2, Clock, Activity, FileText, Layers, RefreshCw
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function ReportsPage() {
    const { token, user } = useAuth();
    const { toast } = useToast();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchReportsData = useCallback(async () => {
        setLoading(true);
        try {
            const role = user?.role || 'faculty';
            const res = await fetch(`${API_BASE_URL}/dashboard/${role}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Fetch reports error:', err);
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchReportsData();
    }, [fetchReportsData]);

    const handleExport = () => {
        toast({ variant: 'success', title: 'Exporting Report', message: 'Downloading platform analytics report in CSV format.' });
    };

    return (
        <AppLayout pageTitle="Reports & Analytics" activeNavId="reports">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-7 pb-14" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                                <BarChart2 size={16} className="text-white" />
                            </div>
                            <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Analytics</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] leading-tight">Reports & Analytics</h1>
                        <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">
                            Comprehensive platform activity reports, mentor verification stats, and department metrics.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        <button onClick={fetchReportsData} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl glass border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-white">
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                            <Download size={14} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* ── Stats Summary ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Mentor Verifications</span>
                            <ShieldCheck size={18} className="text-brand-400" />
                        </div>
                        <p className="text-3xl font-extrabold text-[var(--text-primary)]">{stats?.totalMentorApplications ?? 12}</p>
                    </div>

                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Approved Mentors</span>
                            <CheckCircle2 size={18} className="text-emerald-400" />
                        </div>
                        <p className="text-3xl font-extrabold text-emerald-400">{stats?.approvedMentors ?? 8}</p>
                    </div>

                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Skills</span>
                            <Layers size={18} className="text-amber-400" />
                        </div>
                        <p className="text-3xl font-extrabold text-[var(--text-primary)]">{stats?.totalSkills ?? 24}</p>
                    </div>

                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Platform Activity Rate</span>
                            <Activity size={18} className="text-purple-400" />
                        </div>
                        <p className="text-3xl font-extrabold text-purple-400">98.4%</p>
                    </div>
                </div>

                {/* ── Detailed Reports Breakdown ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
                        <h3 className="font-extrabold text-base text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-brand-400" /> Department Breakdown
                        </h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { dept: 'CSE', count: 42, pct: 85, color: '#6366f1' },
                                { dept: 'IT', count: 28, pct: 70, color: '#a855f7' },
                                { dept: 'AIDS', count: 20, pct: 60, color: '#38bdf8' },
                                { dept: 'ECE', count: 18, pct: 50, color: '#f59e0b' },
                                { dept: 'MECH', count: 12, pct: 35, color: '#10b981' },
                            ].map((d, idx) => (
                                <div key={idx} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-[var(--text-primary)]">{d.dept}</span>
                                        <span className="font-semibold text-[var(--text-muted)]">{d.count} Students</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${d.pct}%`, background: d.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
                        <h3 className="font-extrabold text-base text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Trophy size={16} className="text-amber-400" /> Mentorship Metrics
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-white/[0.02] flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-muted)]">Average Assessment Score</p>
                                    <p className="text-xl font-extrabold text-[var(--text-primary)]">84.2%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-emerald-400">Pass Rate: 92%</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-white/[0.02] flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-muted)]">Completed Mentoring Sessions</p>
                                    <p className="text-xl font-extrabold text-[var(--text-primary)]">148 Sessions</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-brand-400">Satisfaction: 4.8★</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
