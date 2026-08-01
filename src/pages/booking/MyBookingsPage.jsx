import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Calendar, Clock, CheckCircle2,
    Search, CalendarClock, History,
    RefreshCw, XCircle, CheckCircle, ShieldCheck,
    BookOpen, GraduationCap, Users, Award
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { Card, CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'];

function getStatusBadge(status) {
    switch (status?.toLowerCase()) {
        case 'pending':   return { variant: 'warning',  label: 'Pending'   };
        case 'accepted':  return { variant: 'success',  label: 'Accepted'  };
        case 'rejected':  return { variant: 'danger',   label: 'Rejected'  };
        case 'completed': return { variant: 'primary',  label: 'Completed' };
        case 'cancelled': return { variant: 'default',  label: 'Cancelled' };
        default:          return { variant: 'default',  label: status || 'Pending' };
    }
}

export default function MyBookingsPage() {
    const { navigate } = useRouter();
    const { token, user } = useAuth();
    const { toast } = useToast();

    const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';
    const [isVerifiedMentor, setIsVerifiedMentor] = useState(user?.isVerifiedMentor === true);

    // Dynamic mentor check
    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE_URL}/mentor/my-skills`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setIsVerifiedMentor(true);
                }
            })
            .catch(() => {});
    }, [token]);

    // VIEW MODE: 'learning' | 'teaching'
    const [viewMode, setViewMode] = useState('learning');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusTab, setStatusTab] = useState('All');

    // Reject modal
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // ─── Fetch bookings ────────────────────────────────────────────────────────
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/bookings`;
            if (!isFacultyOrAdmin) {
                const type = viewMode === 'learning' ? 'learning' : 'teaching';
                url += `?type=${type}`;
            }
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setBookings(data.data);
            } else {
                toast({ variant: 'error', title: 'Error Loading Bookings', message: data.message || 'Failed to fetch session bookings.' });
            }
        } catch (err) {
            console.error('Fetch bookings error:', err);
            toast({ variant: 'error', title: 'Network Error', message: 'Could not connect to backend server.' });
        } finally {
            setLoading(false);
        }
    }, [token, toast, viewMode, isFacultyOrAdmin]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    // ─── Status update ─────────────────────────────────────────────────────────
    const handleStatusUpdate = async (bookingId, newStatus, reason = '') => {
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus, rejectionReason: reason })
            });
            const data = await res.json();
            if (data.success) {
                toast({
                    variant: newStatus === 'accepted' || newStatus === 'completed' ? 'success' : 'info',
                    title: `Booking ${newStatus.toUpperCase()}`,
                    message: data.message
                });
                setRejectModalOpen(false);
                setSelectedBooking(null);
                setRejectionReason('');
                fetchBookings();
            } else {
                toast({ variant: 'error', title: 'Action Failed', message: data.message || 'Could not update booking status.' });
            }
        } catch (err) {
            console.error('Update status error:', err);
            toast({ variant: 'error', title: 'Network Error', message: 'Failed to update booking status.' });
        } finally {
            setIsUpdating(false);
        }
    };

    // ─── Filter ────────────────────────────────────────────────────────────────
    const filteredBookings = useMemo(() => bookings.filter(b => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (b.student?.fullName || '').toLowerCase().includes(q) ||
            (b.mentor?.fullName || '').toLowerCase().includes(q) ||
            (b.skillName || '').toLowerCase().includes(q) ||
            (b.topic || '').toLowerCase().includes(q);
        const matchStatus = statusTab === 'All' || b.status?.toLowerCase() === statusTab.toLowerCase();
        return matchSearch && matchStatus;
    }), [bookings, search, statusTab]);

    // ─── Stats ─────────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        total:     bookings.length,
        pending:   bookings.filter(b => b.status === 'pending').length,
        accepted:  bookings.filter(b => b.status === 'accepted').length,
        completed: bookings.filter(b => b.status === 'completed').length,
    }), [bookings]);

    // ─── Helpers to check booking ownership ───────────────────────────────────
    const amLearner = (b) => {
        const sid = b.student?._id || b.student;
        return sid?.toString() === user?._id?.toString();
    };
    const amTeacher = (b) => {
        const mid = b.mentor?._id || b.mentor;
        return mid?.toString() === user?._id?.toString();
    };

    const pageTitle = isFacultyOrAdmin
        ? 'System Session Bookings'
        : viewMode === 'teaching'
        ? "Sessions I'm Teaching"
        : "Sessions I'm Learning";

    const pageDesc = isFacultyOrAdmin
        ? 'Overview of all mentoring session bookings across the platform.'
        : viewMode === 'teaching'
        ? 'Manage incoming session requests from learners.'
        : "Track the sessions you've booked with mentors.";

    return (
        <AppLayout pageTitle="Session Bookings" activeNavId="bookings">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-8 pb-10" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] my-0 mb-1">{pageTitle}</h1>
                        <p className="text-[var(--text-secondary)] text-[0.95rem] font-medium">{pageDesc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={fetchBookings}
                            leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}>
                            Refresh
                        </Button>
                        {!isFacultyOrAdmin && (
                            <Button variant="primary" onClick={() => navigate('book-session')}
                                leftIcon={<BookOpen size={14} />}>
                                Book New Session
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── Learning / Teaching Tab Switcher ── */}
                {!isFacultyOrAdmin && (
                    <div className="flex gap-2 p-1 rounded-2xl glass border border-[var(--border-color)] w-fit">
                        <button
                            id="tab-learning"
                            onClick={() => { setViewMode('learning'); setStatusTab('All'); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                viewMode === 'learning'
                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            <GraduationCap size={15} /> Learning
                        </button>
                        {isVerifiedMentor && (
                            <button
                                id="tab-teaching"
                                onClick={() => { setViewMode('teaching'); setStatusTab('All'); }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    viewMode === 'teaching'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                <Users size={15} /> Teaching
                            </button>
                        )}
                    </div>
                )}

                {/* ── Not-a-mentor notice ── */}
                {!isFacultyOrAdmin && !isVerifiedMentor && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-amber-300">
                        <Award size={18} className="flex-shrink-0" />
                        <p className="text-sm font-medium">
                            You are not yet a <strong>Verified Mentor</strong>. Once verified by faculty, you will also see a <em>Teaching</em> tab here to manage incoming session requests.
                        </p>
                    </div>
                )}

                {/* ── Stats Bar ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Sessions',    value: stats.total,     color: '#6366f1', Icon: CalendarClock },
                        { label: 'Pending Requests',  value: stats.pending,   color: '#f59e0b', Icon: Clock        },
                        { label: 'Accepted Sessions', value: stats.accepted,  color: '#10b981', Icon: CheckCircle2 },
                        { label: 'Completed',         value: stats.completed, color: '#8b5cf6', Icon: History      },
                    ].map(({ label, value, color, Icon }, i) => (
                        <div key={i} className="p-4 rounded-xl glass border border-[var(--border-color)] flex items-center justify-between">
                            <div>
                                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
                                <p className="text-2xl font-extrabold text-[var(--text-primary)]">{value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>
                                <Icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Search & Status Filter ── */}
                <div className="glass p-4 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-2 flex-1 w-full max-w-lg items-center gap-2">
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by name, skill, or topic..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none flex-1 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                        />
                    </div>
                    <div className="flex bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl overflow-hidden flex-shrink-0">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setStatusTab(tab)}
                                className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                                    statusTab === tab ? 'bg-brand-600 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Booking Cards ── */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-52 rounded-2xl glass animate-pulse" />
                        ))}
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredBookings.map(b => {
                            const badgeInfo     = getStatusBadge(b.status);
                            const formattedDate = new Date(b.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            const isPending     = b.status === 'pending';
                            const isAccepted    = b.status === 'accepted';
                            const iAmLearner    = amLearner(b);
                            const iAmTeacher    = amTeacher(b);

                            // The "other party" label
                            const otherName = iAmLearner ? (b.mentor?.fullName  || 'Mentor')  : (b.student?.fullName || 'Learner');
                            const otherDept = iAmLearner ? (b.mentor?.department || '—')       : (b.student?.department || '—');
                            const otherRole = iAmLearner ? 'Mentor' : 'Learner';
                            const roleColor = iAmLearner ? '#6366f1' : '#10b981';

                            return (
                                <Card key={b._id} variant="glass" className="flex flex-col hover:border-brand-500/40 transition-colors">
                                    <CardBody className="p-5 flex flex-col gap-4 h-full">

                                        {/* Card Header */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[0.6rem] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                                        style={{ background: `${roleColor}18`, color: roleColor }}>
                                                        {otherRole}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-base text-[var(--text-primary)] truncate">{otherName}</h3>
                                                <p className="text-xs text-[var(--text-muted)]">{otherDept}</p>
                                            </div>
                                            <Badge variant={badgeInfo.variant} size="sm">{badgeInfo.label}</Badge>
                                        </div>

                                        {/* Session Details */}
                                        <div className="flex flex-col gap-2 text-xs text-[var(--text-secondary)] flex-1">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={13} className="text-brand-400 flex-shrink-0" />
                                                <span className="font-bold text-[var(--text-primary)] truncate">{b.skillName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={13} className="text-purple-400 flex-shrink-0" />
                                                <span>{formattedDate} · {b.scheduledTime}</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] mt-1">
                                                <p className="font-bold text-[var(--text-primary)] mb-0.5">Topic / Doubt:</p>
                                                <p className="line-clamp-2">{b.topic}</p>
                                            </div>
                                            {b.rejectionReason && (
                                                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
                                                    <span className="font-bold">Rejection Reason:</span> {b.rejectionReason}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between mt-auto">

                                            {/* LEARNER: can only cancel pending */}
                                            {iAmLearner && !iAmTeacher && (
                                                isPending ? (
                                                    <Button variant="danger" size="sm"
                                                        onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                                                        disabled={isUpdating} leftIcon={<XCircle size={13} />}>
                                                        Cancel Request
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-[var(--text-muted)] italic">Status: {badgeInfo.label}</span>
                                                )
                                            )}

                                            {/* TEACHER (verified mentor): accept / reject / complete */}
                                            {iAmTeacher && !iAmLearner && (
                                                isPending ? (
                                                    <div className="flex items-center gap-2 w-full justify-end">
                                                        <Button variant="success" size="sm"
                                                            onClick={() => handleStatusUpdate(b._id, 'accepted')}
                                                            disabled={isUpdating} leftIcon={<CheckCircle size={13} />}>
                                                            Accept
                                                        </Button>
                                                        <Button variant="danger" size="sm"
                                                            onClick={() => { setSelectedBooking(b); setRejectModalOpen(true); }}
                                                            disabled={isUpdating} leftIcon={<XCircle size={13} />}>
                                                            Reject
                                                        </Button>
                                                    </div>
                                                ) : isAccepted ? (
                                                    <Button variant="primary" size="sm"
                                                        onClick={() => handleStatusUpdate(b._id, 'completed')}
                                                        disabled={isUpdating} leftIcon={<ShieldCheck size={13} />}>
                                                        Mark Completed
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-[var(--text-muted)] italic">Status: {badgeInfo.label}</span>
                                                )
                                            )}

                                            {/* Faculty/Admin: view-only */}
                                            {isFacultyOrAdmin && (
                                                <span className="text-xs text-[var(--text-muted)] font-mono">
                                                    ID: {b._id?.slice(-6)}
                                                </span>
                                            )}
                                        </div>

                                    </CardBody>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center p-14 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[rgba(255,255,255,0.01)] mt-4">
                        <CalendarClock size={40} className="text-brand-400 mb-3" />
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">No session bookings found</h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4">
                            {viewMode === 'teaching'
                                ? "You haven't received any session requests yet."
                                : "You haven't booked any mentoring sessions yet."}
                        </p>
                        {viewMode === 'learning' && !isFacultyOrAdmin && (
                            <Button variant="primary" onClick={() => navigate('book-session')}>
                                Book a Session
                            </Button>
                        )}
                    </div>
                )}

                {/* ── Reject Modal ── */}
                <Modal
                    open={rejectModalOpen}
                    onClose={() => !isUpdating && setRejectModalOpen(false)}
                    title="Reject Booking Request"
                    description={`Provide a reason for rejecting the booking request from ${selectedBooking?.student?.fullName}.`}
                    size="sm"
                >
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                Rejection Reason <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                placeholder="Explain why you cannot take this session (e.g. Schedule conflict, out of scope)..."
                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                            <Button variant="outline" onClick={() => setRejectModalOpen(false)} disabled={isUpdating}>
                                Cancel
                            </Button>
                            <Button variant="danger"
                                onClick={() => handleStatusUpdate(selectedBooking._id, 'rejected', rejectionReason)}
                                disabled={isUpdating || !rejectionReason.trim()}>
                                {isUpdating ? 'Rejecting...' : 'Confirm Rejection'}
                            </Button>
                        </div>
                    </div>
                </Modal>

            </div>
        </AppLayout>
    );
}

