import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Search, Phone, Video, MoreVertical, Paperclip, Smile,
    Send, Check, CheckCheck, X, Star, Calendar, Eye,
    BookOpen, Flag, ChevronRight, MessageCircle, Zap,
    File, Image as ImageIcon, Download, Circle, RefreshCw, ShieldAlert
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const EMOJIS = ['👍', '🙌', '🧠', '🚀', '👀', '🔥', '💡', '✅', '❤️', '🎉'];

/* ─── Helpers ──────────────────────────────────────────────────────────── */
function formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDateHeader(dateStr) {
    if (!dateStr) return 'Today';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Today';

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function groupByDate(messages) {
    const groups = {};
    messages.forEach(m => {
        const d = formatDateHeader(m.createdAt);
        if (!groups[d]) groups[d] = [];
        groups[d].push(m);
    });
    return groups;
}

/* ─── Empty State ──────────────────────────────────────────────────────── */
function EmptyState({ hasConversations }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="relative">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <MessageCircle size={40} className="text-brand-400 opacity-60" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                    <Zap size={14} className="text-white" />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-extrabold text-[var(--text-primary)] mb-1">
                    {hasConversations ? 'Select a conversation' : 'No Active Conversations'}
                </h3>
                <p className="text-sm text-[var(--text-muted)] font-medium max-w-sm">
                    {hasConversations
                        ? 'Choose a mentor or student from the left sidebar to start chatting.'
                        : 'Students and Mentors can only chat after a session booking request has been accepted by the mentor.'}
                </p>
            </div>
        </div>
    );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function MessagesPage() {
    const { token, user } = useAuth();
    const { toast } = useToast();

    const role = user?.role;
    const isForbiddenRole = role === 'faculty' || role === 'admin';

    // State
    const [conversations, setConversations] = useState([]);
    const [loadingConvos, setLoadingConvos] = useState(true);
    const [activeBookingId, setActiveBookingId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [search, setSearch] = useState('');
    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMobileRight, setShowMobileRight] = useState(false);

    const bottomRef = useRef(null);

    // Fetch conversations from backend
    const fetchConversations = useCallback(async () => {
        if (isForbiddenRole) return;
        setLoadingConvos(true);
        try {
            const res = await fetch(`${API_BASE_URL}/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setConversations(data.data);
                if (data.data.length > 0 && !activeBookingId) {
                    setActiveBookingId(data.data[0].bookingId);
                }
            }
        } catch (err) {
            console.error('Fetch conversations error:', err);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to fetch active conversations.',
            });
        } finally {
            setLoadingConvos(false);
        }
    }, [token, isForbiddenRole, activeBookingId, toast]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Fetch messages for active conversation
    const fetchMessages = useCallback(async (bookingId) => {
        if (!bookingId || isForbiddenRole) return;
        setLoadingMessages(true);
        try {
            const res = await fetch(`${API_BASE_URL}/messages/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setMessages(data.data);
                // Reset unread count in local conversations list
                setConversations(prev => prev.map(c => c.bookingId === bookingId ? { ...c, unreadCount: 0 } : c));
            }
        } catch (err) {
            console.error('Fetch messages error:', err);
        } finally {
            setLoadingMessages(false);
        }
    }, [token, isForbiddenRole]);

    useEffect(() => {
        if (activeBookingId) {
            fetchMessages(activeBookingId);
        }
    }, [activeBookingId, fetchMessages]);

    // Auto scroll bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, activeBookingId]);

    // Active conversation object
    const activeConvo = conversations.find(c => c.bookingId === activeBookingId) || null;

    // Filter conversations search
    const filteredConvos = conversations.filter(c =>
        !search ||
        c.partner?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.skillName?.toLowerCase().includes(search.toLowerCase())
    );

    // Send Message handler
    const handleSendMessage = async (customText = null, msgType = 'text') => {
        const textToSend = customText || input;
        if (!textToSend.trim() || !activeConvo) return;

        const payload = {
            receiverId: activeConvo.partner._id,
            bookingId: activeConvo.bookingId,
            message: textToSend.trim(),
            messageType: msgType,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success && data.data) {
                setMessages(prev => [...prev, data.data]);
                setInput('');
                setShowEmojiPicker(false);
                // Update last message in conversation list
                setConversations(prev => prev.map(c => c.bookingId === activeConvo.bookingId ? {
                    ...c,
                    lastMessage: data.data.message,
                    lastMessageTime: data.data.createdAt,
                } : c));
            } else {
                toast({
                    variant: 'error',
                    title: 'Send Error',
                    message: data.message || 'Failed to send message.',
                });
            }
        } catch (err) {
            console.error('Send message error:', err);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to send message.',
            });
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // If Faculty or Admin, show Restricted Access Banner
    if (isForbiddenRole) {
        return (
            <AppLayout pageTitle="Messages" activeNavId="messages">
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass border border-[var(--border-color)] max-w-xl mx-auto my-12 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Messaging Restricted</h2>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Faculty and Admin members cannot access the student/mentor chat module. Messaging is strictly reserved for Students and Verified Mentors with accepted booking requests.
                    </p>
                </div>
            </AppLayout>
        );
    }

    const groupedMessages = groupByDate(messages);

    return (
        <AppLayout pageTitle="Messages" activeNavId="messages">
            <div
                className="flex gap-0 rounded-2xl overflow-hidden border border-[var(--border-color)]"
                style={{
                    height: 'calc(100vh - 112px)',
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(18px)',
                }}
            >
                {/* ════════════════════════════════
                    LEFT — Conversation List
                ════════════════════════════════ */}
                <div
                    className={`flex flex-col border-r border-[var(--border-color)] flex-shrink-0 ${activeBookingId ? 'hidden md:flex' : 'flex'}`}
                    style={{ width: '280px', minWidth: '280px' }}
                >
                    {/* Header */}
                    <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-extrabold text-base text-[var(--text-primary)]">Messages</h2>
                            <button onClick={fetchConversations} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                <RefreshCw size={14} className={loadingConvos ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <input
                                id="msg-search"
                                type="text"
                                placeholder="Search conversations..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white/[0.04] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Convo List */}
                    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                        {loadingConvos ? (
                            <div className="p-4 space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
                            </div>
                        ) : filteredConvos.length === 0 ? (
                            <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                                No active accepted booking conversations found.
                            </div>
                        ) : (
                            filteredConvos.map(c => {
                                const isSelected = activeBookingId === c.bookingId;
                                const partner = c.partner || {};

                                return (
                                    <button
                                        key={c.bookingId}
                                        onClick={() => { setActiveBookingId(c.bookingId); setShowMobileRight(false); }}
                                        className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all border-b border-[var(--border-color)] last:border-0 hover:bg-white/[0.04] ${isSelected ? 'bg-brand-600/10 border-l-2 border-l-brand-500' : ''}`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center border border-[var(--border-color)]">
                                                {partner.fullName ? partner.fullName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-glass)] bg-emerald-400" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                <span className="font-bold text-sm text-[var(--text-primary)] truncate">{partner.fullName}</span>
                                                <span className="text-[0.6rem] font-medium text-[var(--text-muted)] flex-shrink-0">
                                                    {formatTime(c.lastMessageTime)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="text-[0.7rem] text-[var(--text-muted)] truncate flex-1">{c.lastMessage}</span>
                                                {c.unreadCount > 0 && (
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-600 text-white text-[0.55rem] font-extrabold flex items-center justify-center shadow">
                                                        {c.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="mt-1 inline-block text-[0.58rem] font-bold px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-400">
                                                {c.skillName}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ════════════════════════════════
                    CENTER — Chat Window
                ════════════════════════════════ */}
                <div className={`flex flex-col flex-1 min-w-0 ${!activeBookingId ? 'hidden md:flex' : 'flex'}`}>
                    {!activeConvo ? (
                        <EmptyState hasConversations={conversations.length > 0} />
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border-color)] bg-white/[0.015] flex-shrink-0">
                                <button
                                    className="md:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                    onClick={() => setActiveBookingId(null)}
                                >
                                    <ChevronRight size={16} className="rotate-180" />
                                </button>
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center border border-[var(--border-color)]">
                                        {activeConvo.partner?.fullName ? activeConvo.partner.fullName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-glass)] bg-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-[var(--text-primary)] leading-tight">{activeConvo.partner?.fullName}</p>
                                    <p className="text-[0.68rem] font-medium text-emerald-400">
                                        ● Online · {activeConvo.skillName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button onClick={() => setShowMobileRight(v => !v)} className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-white/5 xl:hidden">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Body */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1" style={{ scrollbarWidth: 'thin' }}>
                                {loadingMessages ? (
                                    <div className="flex justify-center p-8 text-xs text-[var(--text-muted)]">Loading messages...</div>
                                ) : (
                                    Object.entries(groupedMessages).map(([date, msgs]) => (
                                        <div key={date}>
                                            <div className="flex items-center gap-3 my-4">
                                                <div className="flex-1 h-px bg-[var(--border-color)]" />
                                                <span className="text-[0.62rem] font-bold text-[var(--text-muted)] bg-[var(--bg-glass)] px-3 py-1 rounded-full border border-[var(--border-color)]">{date}</span>
                                                <div className="flex-1 h-px bg-[var(--border-color)]" />
                                            </div>

                                            {msgs.map(msg => {
                                                const isMe = (msg.sender?._id || msg.sender) === user?._id;

                                                return (
                                                    <div key={msg._id} className={`flex items-end gap-2 mb-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[68%]`}>
                                                            <div
                                                                className="px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed break-words"
                                                                style={isMe ? {
                                                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                                                    color: 'white',
                                                                    borderBottomRightRadius: '6px',
                                                                } : {
                                                                    background: 'var(--bg-elevated)',
                                                                    color: 'var(--text-primary)',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderBottomLeftRadius: '6px',
                                                                }}
                                                            >
                                                                {msg.message}
                                                            </div>
                                                            <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                                <span className="text-[0.58rem] text-[var(--text-muted)] font-medium">{formatTime(msg.createdAt)}</span>
                                                                {isMe && (
                                                                    msg.isRead
                                                                        ? <CheckCheck size={12} className="text-brand-400" />
                                                                        : <Check size={12} className="text-[var(--text-muted)]" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input Bar */}
                            <div className="px-4 py-3 border-t border-[var(--border-color)] bg-white/[0.01] flex-shrink-0 relative">
                                {showEmojiPicker && (
                                    <div className="absolute bottom-16 left-4 p-2 bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl flex gap-2 shadow-xl z-20">
                                        {EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => handleSendMessage(emoji, 'emoji')}
                                                className="text-lg hover:scale-125 transition-transform p-1"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-end gap-2 bg-white/[0.04] border border-[var(--border-color)] rounded-2xl px-3 py-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(v => !v)}
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-brand-400 transition-all"
                                    >
                                        <Smile size={17} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => toast({ variant: 'info', title: 'File Attachment', message: 'File upload placeholder feature.' })}
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-brand-400 transition-all"
                                    >
                                        <Paperclip size={16} />
                                    </button>
                                    <textarea
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKey}
                                        placeholder="Type a message... (Enter to send)"
                                        rows={1}
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none py-0.5 max-h-28"
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!input.trim()}
                                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                                    >
                                        <Send size={15} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ════════════════════════════════
                    RIGHT — Conversation Details
                ════════════════════════════════ */}
                {activeConvo && (
                    <div
                        className={`flex-col border-l border-[var(--border-color)] overflow-y-auto flex-shrink-0 ${showMobileRight ? 'flex fixed inset-y-0 right-0 z-50 bg-[var(--bg-surface)] w-72' : 'hidden xl:flex'}`}
                        style={{ width: '264px', minWidth: '264px' }}
                    >
                        <div className="p-5 border-b border-[var(--border-color)] text-center">
                            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 border border-[var(--border-color)]">
                                {activeConvo.partner?.fullName ? activeConvo.partner.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <p className="font-extrabold text-base text-[var(--text-primary)]">{activeConvo.partner?.fullName}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{activeConvo.partner?.department || 'CSE'} · {activeConvo.partner?.role}</p>
                        </div>

                        <div className="p-4 flex flex-col gap-3">
                            <p className="text-[0.65rem] font-bold uppercase text-[var(--text-muted)]">Accepted Session Skill</p>
                            <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs font-bold text-brand-300">
                                {activeConvo.skillName}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
