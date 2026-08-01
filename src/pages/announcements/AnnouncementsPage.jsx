import { useState, useEffect, useCallback } from 'react';
import {
    Bell, Megaphone, Plus, Pin, Trash2, Calendar, User,
    Sparkles, AlertCircle, RefreshCw, CheckCircle2, MessageSquare
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function AnnouncementsPage() {
    const { token, user } = useAuth();
    const { toast } = useToast();

    const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        targetRole: 'all',
        isPinned: false
    });

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/announcements`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setAnnouncements(data.data);
            }
        } catch (err) {
            console.error('Fetch announcements error:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            toast({ variant: 'error', title: 'Validation Error', message: 'Please provide both title and content.' });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/announcements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success && data.data) {
                toast({ variant: 'success', title: 'Announcement Created', message: 'Platform announcement posted successfully.' });
                setFormData({ title: '', content: '', category: 'general', targetRole: 'all', isPinned: false });
                setShowModal(false);
                fetchAnnouncements();
            } else {
                toast({ variant: 'error', title: 'Error', message: data.message });
            }
        } catch (err) {
            console.error('Create announcement error:', err);
            toast({ variant: 'error', title: 'Network Error', message: 'Failed to post announcement.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast({ variant: 'success', title: 'Deleted', message: 'Announcement deleted.' });
                fetchAnnouncements();
            }
        } catch (err) {
            console.error('Delete announcement error:', err);
        }
    };

    return (
        <AppLayout pageTitle="Announcements" activeNavId="announcements">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-7 pb-14" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                                <Megaphone size={16} className="text-white" />
                            </div>
                            <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Updates</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] leading-tight">Platform Announcements</h1>
                        <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">
                            Stay informed with official updates, contest notices, and placement news.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        <button onClick={fetchAnnouncements} className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-white">
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                        {isFacultyOrAdmin && (
                            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <Plus size={14} /> New Announcement
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Announcements Feed ── */}
                {loading ? (
                    <div className="py-16 text-center text-xs text-[var(--text-muted)]">
                        Loading announcements...
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="glass border border-[var(--border-color)] rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-[var(--border-color)] flex items-center justify-center mx-auto mb-4">
                            <Megaphone size={28} className="text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">No Announcements Yet</h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                            Check back soon for upcoming workshops, campus updates, and placement notices.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {announcements.map((item) => (
                            <div key={item._id} className={`glass border rounded-2xl p-6 relative transition-all ${item.isPinned ? 'border-amber-500/40 bg-amber-500/5' : 'border-[var(--border-color)]'}`}>
                                {item.isPinned && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[0.65rem] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                                        <Pin size={12} /> Pinned
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[0.62rem] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-brand-500/15 text-brand-300 border border-brand-500/25">
                                        {item.category}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)] font-medium">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">{item.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line mb-4">{item.content}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                                        <User size={13} /> Posted by <span className="text-[var(--text-primary)] font-bold">{item.createdBy?.fullName || 'Faculty'}</span> ({item.createdBy?.role})
                                    </div>

                                    {isFacultyOrAdmin && (
                                        <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Modal: Post Announcement ── */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-6 max-w-lg w-full">
                            <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-4">Post New Announcement</h3>
                            <form onSubmit={handleCreate} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Workshop: Master Java Spring Boot"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-brand-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] outline-none"
                                    >
                                        <option value="general">General Update</option>
                                        <option value="workshop">Workshop & Session</option>
                                        <option value="exam">Exam & Assessment</option>
                                        <option value="placement">Placement & Careers</option>
                                        <option value="contest">Hackathon & Contest</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">Announcement Body</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Provide full details about the workshop or update..."
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-brand-500"
                                        required
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPinned}
                                        onChange={e => setFormData({ ...formData, isPinned: e.target.checked })}
                                        className="accent-brand-500"
                                    />
                                    Pin to top of feed
                                </label>

                                <div className="flex justify-end gap-2 mt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-white">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md">
                                        {submitting ? 'Posting...' : 'Publish Announcement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
