import { useState, useEffect, useCallback } from 'react';
import {
    Users, Search, Calendar, MessageCircle, RefreshCw,
    UserCheck, BookOpen, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function MyStudentsPage() {
    const { token, user } = useAuth();
    const { navigate } = useRouter();
    const { toast } = useToast();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/mentor/students`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setStudents(data.data);
            } else {
                toast({ variant: 'error', title: 'Error', message: data.message || 'Failed to fetch assigned students.' });
            }
        } catch (err) {
            console.error('Fetch assigned students error:', err);
            toast({ variant: 'error', title: 'Network Error', message: 'Failed to connect to backend server.' });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            (s.registerNumber && s.registerNumber.toLowerCase().includes(search.toLowerCase()));
        const matchesDept = deptFilter === 'All' || s.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    const handleMessage = () => {
        navigate('messages');
    };

    return (
        <AppLayout pageTitle="My Students" activeNavId="students">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-7 pb-14" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <Users size={16} className="text-white" />
                            </div>
                            <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Mentorship</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] leading-tight">My Students</h1>
                        <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">
                            Manage and view students who have booked mentoring sessions with you.
                        </p>
                    </div>

                    <button onClick={fetchStudents} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-white transition-all self-start sm:self-auto">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh List
                    </button>
                </div>

                {/* ── Metric Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Students Mentored</span>
                            <UserCheck size={18} className="text-brand-400" />
                        </div>
                        <p className="text-3xl font-extrabold text-[var(--text-primary)]">{students.length}</p>
                    </div>

                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Sessions</span>
                            <BookOpen size={18} className="text-amber-400" />
                        </div>
                        <p className="text-3xl font-extrabold text-[var(--text-primary)]">
                            {students.reduce((acc, curr) => acc + (curr.totalSessions || 1), 0)}
                        </p>
                    </div>

                    <div className="glass border border-[var(--border-color)] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Status</span>
                            <CheckCircle2 size={18} className="text-emerald-400" />
                        </div>
                        <p className="text-3xl font-extrabold text-emerald-400">Verified Mentor</p>
                    </div>
                </div>

                {/* ── Filters & Search ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by student name, email, or register number..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-500"
                        />
                    </div>

                    <select
                        value={deptFilter}
                        onChange={e => setDeptFilter(e.target.value)}
                        className="bg-white/[0.03] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                    >
                        {['All', 'CSE', 'IT', 'AIDS', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'].map(d => (
                            <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
                        ))}
                    </select>
                </div>

                {/* ── Students Cards / Grid ── */}
                {loading ? (
                    <div className="py-16 text-center text-xs text-[var(--text-muted)]">
                        Loading assigned students...
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-[var(--border-color)] flex items-center justify-center mx-auto mb-4">
                            <Users size={28} className="text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">No Students Found</h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                            Students will automatically appear here once they book mentoring sessions with you.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredStudents.map(student => (
                            <div key={student._id} className="glass border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between group hover:border-brand-500/40 transition-all">
                                <div>
                                    <div className="flex items-center gap-3.5 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 font-extrabold flex items-center justify-center border border-brand-500/30 text-lg">
                                            {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-extrabold text-base text-[var(--text-primary)] truncate">{student.fullName}</h4>
                                            <p className="text-xs text-[var(--text-muted)] font-medium truncate">{student.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/20">
                                                    {student.department}
                                                </span>
                                                <span className="text-[0.6rem] font-bold text-[var(--text-muted)]">
                                                    Yr {student.year}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-[var(--border-color)] rounded-xl p-3 flex flex-col gap-1.5 mb-4">
                                        <div className="flex justify-between items-center text-[0.68rem]">
                                            <span className="text-[var(--text-muted)] font-medium">Last Session Topic:</span>
                                            <span className="font-bold text-[var(--text-primary)] truncate max-w-[140px]">{student.lastTopic || 'Mentoring Session'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[0.68rem]">
                                            <span className="text-[var(--text-muted)] font-medium">Sessions Booked:</span>
                                            <span className="font-extrabold text-brand-400">{student.totalSessions} session(s)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[0.68rem]">
                                            <span className="text-[var(--text-muted)] font-medium">Status:</span>
                                            <span className="font-bold text-emerald-400 capitalize">{student.lastStatus || 'accepted'}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleMessage}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-500/30 text-xs font-bold transition-all"
                                >
                                    <MessageCircle size={14} /> Open Chat
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
