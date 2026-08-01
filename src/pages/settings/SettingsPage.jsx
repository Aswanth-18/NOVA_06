import React, { useState } from 'react';
import {
    User, Palette, Bell, Shield, Link2, HelpCircle, Info, LogOut,
    Edit3, Lock, Sun, Moon, Monitor, Check, ChevronRight,
    GitBranch, Briefcase, Globe, Eye, EyeOff, Smartphone,
    MessageCircle, Calendar, AlertTriangle, BookOpen, Zap,
    LifeBuoy, Bug, MessageSquare, Trash2,
    ExternalLink, BadgeCheck, Mail, Phone,
    GraduationCap, Layers, Type, Sliders, History,
    Settings as SettingsIcon, Trophy, Users
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';

/* ─── Tab definitions ───────────────────────────────────────────────────── */
const TABS = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'connected', label: 'Connected Accounts', icon: Link2 },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
];

/* ─── Toggle Switch ─────────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none flex-shrink-0"
            style={{ background: checked ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.1)' }}
        >
            <span
                className="inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-300"
                style={{ transform: checked ? 'translateX(24px)' : 'translateX(4px)' }}
            />
        </button>
    );
}

/* ─── Section card ───────────────────────────────────────────────────────── */
function Section({ title, children }) {
    return (
        <div className="glass border border-[var(--border-color)] rounded-2xl p-6">
            {title && (
                <h3 className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}

/* ─── Setting Row ────────────────────────────────────────────────────────── */
function SettingRow({ icon: Icon, iconColor, label, sub, children }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--border-color)] last:border-0">
            <div className="flex items-center gap-3 min-w-0">
                {Icon && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}>
                        <Icon size={15} style={{ color: iconColor }} />
                    </div>
                )}
                <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">{label}</p>
                    {sub && <p className="text-[0.65rem] text-[var(--text-muted)] font-medium mt-0.5">{sub}</p>}
                </div>
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

/* ─── Confirm Modal ─────────────────────────────────────────────────────── */
function ConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
                <div className="h-1.5 w-full" style={{ background: confirmColor }} />
                <div className="p-6">
                    <h3 className="text-lg font-extrabold text-[var(--text-primary)] mb-2">{title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">{message}</p>
                    <div className="flex gap-3">
                        <button onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-white/5 transition-all">
                            Cancel
                        </button>
                        <button onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                            style={{ background: confirmColor, boxShadow: `0 4px 12px ${confirmColor}60` }}>
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Account Tab ────────────────────────────────────────────────────────── */
function AccountTab() {
    const [editMode, setEditMode] = useState(false);
    const [showPassForm, setShowPassForm] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const fields = [
        { label: 'Full Name', id: 'edit-name', val: 'Aswanth S', icon: User, type: 'text' },
        { label: 'Register Number', id: 'edit-reg', val: '21BCE0842', icon: GraduationCap, type: 'text', disabled: true },
        { label: 'Department', id: 'edit-dept', val: 'CSE & Engineering', icon: Layers, type: 'text' },
        { label: 'Year of Study', id: 'edit-year', val: 'Junior Year (3rd)', icon: BookOpen, type: 'text' },
        { label: 'Email', id: 'edit-email', val: 'aswanth@student.vit.ac.in', icon: Mail, type: 'email' },
        { label: 'Phone', id: 'edit-phone', val: '+91 98765 43210', icon: Phone, type: 'tel' },
    ];

    const details = [
        { label: 'Register No.', value: '21BCE0842', icon: GraduationCap, color: '#6366f1' },
        { label: 'Department', value: 'CSE & Engineering', icon: Layers, color: '#a855f7' },
        { label: 'Year', value: 'Junior Year (3rd)', icon: BookOpen, color: '#10b981' },
        { label: 'Email', value: 'aswanth@student.vit.ac.in', icon: Mail, color: '#38bdf8' },
        { label: 'Phone', value: '+91 98765 43210', icon: Phone, color: '#f59e0b' },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Profile hero */}
            <Section>
                <div className="flex items-start gap-5">
                    <div className="relative flex-shrink-0">
                        <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E" alt="Avatar"
                            className="w-20 h-20 rounded-2xl object-cover border-4"
                            style={{ borderColor: 'rgba(99,102,241,0.4)', boxShadow: '0 4px 18px rgba(99,102,241,0.28)' }} />
                        <button id="change-avatar" className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl flex items-center justify-center text-white"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                            <Edit3 size={12} />
                        </button>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Aswanth S</h2>
                            <span className="flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                                <BadgeCheck size={10} /> Verified
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] font-medium">21BCE0842 · Junior Year</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">CSE · VIT Vellore</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            <button id="acct-edit"
                                onClick={() => { setEditMode(v => !v); setShowPassForm(false); }}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                                <Edit3 size={12} /> {editMode ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                            <button id="change-pass"
                                onClick={() => { setShowPassForm(v => !v); setEditMode(false); }}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all">
                                <Lock size={12} /> Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Edit form */}
            {editMode && (
                <Section title={<><Edit3 size={13} className="text-brand-400" /> Edit Information</>}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map(f => (
                            <div key={f.id}>
                                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">{f.label}</label>
                                <div className="relative">
                                    <f.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                    <input id={f.id} type={f.type} defaultValue={f.val} disabled={f.disabled}
                                        className={`w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all ${f.disabled ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button id="save-profile" onClick={() => setEditMode(false)}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                            Save Changes
                        </button>
                        <button onClick={() => setEditMode(false)}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5 transition-all">
                            Cancel
                        </button>
                    </div>
                </Section>
            )}

            {/* Change password */}
            {showPassForm && (
                <Section title={<><Lock size={13} className="text-amber-400" /> Change Password</>}>
                    <div className="flex flex-col gap-4 max-w-sm">
                        {[
                            { label: 'Current Password', id: 'cur-pass', show: showCurrent, toggle: () => setShowCurrent(v => !v) },
                            { label: 'New Password', id: 'new-pass', show: showNew, toggle: () => setShowNew(v => !v) },
                            { label: 'Confirm Password', id: 'con-pass', show: showNew, toggle: () => { } },
                        ].map(f => (
                            <div key={f.id}>
                                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">{f.label}</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                    <input id={f.id} type={f.show ? 'text' : 'password'} placeholder="••••••••"
                                        className="w-full pl-9 pr-10 py-2.5 text-sm bg-white/[0.03] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all" />
                                    <button type="button" onClick={f.toggle}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                        {f.show ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Strength */}
                        <div>
                            <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Password Strength</p>
                            <div className="flex gap-1">
                                {['#ef4444', '#f59e0b', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.08)'].map((c, i) => (
                                    <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: c }} />
                                ))}
                            </div>
                            <p className="text-[0.6rem] text-amber-400 font-bold mt-1">Moderate — add symbols to strengthen</p>
                        </div>
                        <button id="update-pass" onClick={() => setShowPassForm(false)}
                            className="self-start px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                            Update Password
                        </button>
                    </div>
                </Section>
            )}

            {/* Read-only details */}
            {!editMode && !showPassForm && (
                <Section title={<><User size={13} className="text-brand-400" /> Account Details</>}>
                    {details.map(r => (
                        <SettingRow key={r.label} icon={r.icon} iconColor={r.color} label={r.label}>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{r.value}</span>
                        </SettingRow>
                    ))}
                </Section>
            )}
        </div>
    );
}

/* ─── Appearance Tab ─────────────────────────────────────────────────────── */
const ACCENT_COLORS = [
    { id: 'blue', hex: '#3b82f6', label: 'Blue' },
    { id: 'purple', hex: '#8b5cf6', label: 'Purple' },
    { id: 'green', hex: '#10b981', label: 'Green' },
    { id: 'orange', hex: '#f59e0b', label: 'Orange' },
];

function AppearanceTab() {
    const [theme, setTheme] = useState('dark');
    const [accent, setAccent] = useState('blue');
    const [fontSize, setFontSize] = useState('medium');

    return (
        <div className="flex flex-col gap-5">
            {/* Theme */}
            <Section title={<><Sun size={13} className="text-amber-400" /> Theme Mode</>}>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'light', label: 'Light', icon: Sun, preview: '#f0f4ff' },
                        { id: 'dark', label: 'Dark', icon: Moon, preview: '#080e1a' },
                        { id: 'system', label: 'System', icon: Monitor, preview: 'linear-gradient(135deg,#080e1a 50%,#f0f4ff 50%)' },
                    ].map(t => (
                        <button key={t.id} id={`theme-${t.id}`} onClick={() => setTheme(t.id)}
                            className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all ${theme === t.id ? 'border-brand-500/60 bg-brand-500/10' : 'border-[var(--border-color)] bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                            <div className="w-12 h-8 rounded-lg border border-white/10 overflow-hidden" style={{ background: t.preview }} />
                            <t.icon size={16} className={theme === t.id ? 'text-brand-400' : 'text-[var(--text-muted)]'} />
                            <span className={`text-xs font-bold ${theme === t.id ? 'text-brand-400' : 'text-[var(--text-muted)]'}`}>{t.label}</span>
                            {theme === t.id && <Check size={12} className="text-brand-400" />}
                        </button>
                    ))}
                </div>
            </Section>

            {/* Accent */}
            <Section title={<><Palette size={13} className="text-purple-400" /> Accent Color</>}>
                <div className="flex gap-4 flex-wrap">
                    {ACCENT_COLORS.map(c => (
                        <button key={c.id} id={`accent-${c.id}`} onClick={() => setAccent(c.id)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-105 ${accent === c.id ? 'border-white/30' : 'border-[var(--border-color)]'}`}>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: c.hex, boxShadow: accent === c.id ? `0 0 16px ${c.hex}70` : 'none' }}>
                                {accent === c.id && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-[0.62rem] font-bold text-[var(--text-muted)]">{c.label}</span>
                        </button>
                    ))}
                </div>
            </Section>

            {/* Font size */}
            <Section title={<><Type size={13} className="text-blue-400" /> Font Size</>}>
                <div className="flex gap-3">
                    {[
                        { id: 'small', label: 'Small', px: '12px' },
                        { id: 'medium', label: 'Medium', px: '14px' },
                        { id: 'large', label: 'Large', px: '17px' },
                    ].map(f => (
                        <button key={f.id} id={`font-${f.id}`} onClick={() => setFontSize(f.id)}
                            className={`flex-1 flex flex-col items-center gap-2 py-5 rounded-xl border transition-all ${fontSize === f.id ? 'border-brand-500/50 bg-brand-500/10' : 'border-[var(--border-color)] bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                            <span style={{ fontSize: f.px, fontWeight: 800, color: fontSize === f.id ? '#818cf8' : 'var(--text-muted)' }}>Aa</span>
                            <span className={`text-[0.65rem] font-bold ${fontSize === f.id ? 'text-brand-400' : 'text-[var(--text-muted)]'}`}>{f.label}</span>
                        </button>
                    ))}
                </div>
            </Section>
        </div>
    );
}

/* ─── Notifications Tab ──────────────────────────────────────────────────── */
const NOTIF_ITEMS = [
    { key: 'sessionReminders', label: 'Session Reminders', sub: 'Get notified before your sessions start', icon: Calendar, color: '#6366f1' },
    { key: 'bookingUpdates', label: 'Booking Updates', sub: 'Notifications for new bookings and changes', icon: BookOpen, color: '#10b981' },
    { key: 'newMessages', label: 'New Messages', sub: 'Alert when someone sends you a message', icon: MessageCircle, color: '#38bdf8' },
    { key: 'assessmentAlerts', label: 'Assessment Alerts', sub: 'Updates on your mentor assessment status', icon: AlertTriangle, color: '#f59e0b' },
    { key: 'mentorApproval', label: 'Mentor Approval', sub: 'Alerts when faculty reviews your application', icon: BadgeCheck, color: '#a855f7' },
    { key: 'weeklySummary', label: 'Weekly Summary', sub: 'Get a weekly digest of your activity', icon: Zap, color: '#d946ef' },
];

function NotificationsTab() {
    const [notifs, setNotifs] = useState({
        sessionReminders: true, bookingUpdates: true, newMessages: true,
        assessmentAlerts: false, mentorApproval: true, weeklySummary: false,
    });
    return (
        <Section title={<><Bell size={13} className="text-brand-400" /> Notification Preferences</>}>
            {NOTIF_ITEMS.map(n => (
                <SettingRow key={n.key} icon={n.icon} iconColor={n.color} label={n.label} sub={n.sub}>
                    <Toggle checked={notifs[n.key]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                </SettingRow>
            ))}
        </Section>
    );
}

/* ─── Privacy Tab ────────────────────────────────────────────────────────── */
const PRIVACY_ITEMS = [
    { key: 'publicProfile', label: 'Show Profile Publicly', sub: 'Other users can find and view your profile', icon: Eye, color: '#6366f1' },
    { key: 'directMessages', label: 'Allow Direct Messages', sub: 'Let any user send you messages', icon: MessageCircle, color: '#a855f7' },
    { key: 'showProgress', label: 'Show Learning Progress', sub: 'Display your XP and skill progress publicly', icon: Sliders, color: '#10b981' },
    { key: 'twoFactor', label: 'Two-Factor Authentication', sub: 'Extra security via authenticator app or SMS', icon: Smartphone, color: '#f59e0b' },
];

const SECURITY_ITEMS = [
    { label: 'Active Devices', sub: '2 devices logged in', icon: Smartphone, color: '#38bdf8', action: 'Manage' },
    { label: 'Login History', sub: 'Last login: Jul 31, 2025', icon: History, color: '#a855f7', action: 'View' },
    { label: 'Change Password', sub: 'Last changed 3 months ago', icon: Lock, color: '#6366f1', action: 'Update' },
];

function PrivacyTab() {
    const [privacy, setPrivacy] = useState({
        publicProfile: true, directMessages: true, showProgress: true, twoFactor: false,
    });
    return (
        <div className="flex flex-col gap-5">
            <Section title={<><Shield size={13} className="text-emerald-400" /> Privacy Controls</>}>
                {PRIVACY_ITEMS.map(p => (
                    <SettingRow key={p.key} icon={p.icon} iconColor={p.color} label={p.label} sub={p.sub}>
                        <Toggle checked={privacy[p.key]} onChange={() => setPrivacy(prev => ({ ...prev, [p.key]: !prev[p.key] }))} />
                    </SettingRow>
                ))}
            </Section>
            <Section title={<><History size={13} className="text-blue-400" /> Login & Security</>}>
                {SECURITY_ITEMS.map(r => (
                    <SettingRow key={r.label} icon={r.icon} iconColor={r.color} label={r.label} sub={r.sub}>
                        <button className="text-[0.68rem] font-bold px-3 py-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-600 hover:text-white transition-all">
                            {r.action}
                        </button>
                    </SettingRow>
                ))}
            </Section>
        </div>
    );
}

/* ─── Connected Accounts Tab ─────────────────────────────────────────────── */
function ConnectedTab() {
    const [connected, setConnected] = useState({ google: true, github: true, linkedin: false });
    const accounts = [
        { key: 'google', label: 'Google', icon: Globe, color: '#ea4335', connectedSub: 'aswanth@gmail.com', disconnectedSub: 'Not connected' },
        { key: 'github', label: 'GitHub', icon: GitBranch, color: '#e2e8f0', connectedSub: 'github.com/aswanth', disconnectedSub: 'Not connected' },
        { key: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: '#0a66c2', connectedSub: 'linkedin.com/in/aswanth', disconnectedSub: 'Not connected' },
    ];
    return (
        <Section title={<><Link2 size={13} className="text-blue-400" /> Connected Accounts</>}>
            {accounts.map(a => (
                <SettingRow key={a.key} icon={a.icon} iconColor={a.color} label={a.label}
                    sub={connected[a.key] ? a.connectedSub : a.disconnectedSub}>
                    <button id={`connect-${a.key}`}
                        onClick={() => setConnected(p => ({ ...p, [a.key]: !p[a.key] }))}
                        className={`text-[0.68rem] font-bold px-3 py-1.5 rounded-lg border transition-all ${connected[a.key]
                            ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600'
                            : 'border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-600 hover:text-white'}`}>
                        {connected[a.key] ? 'Disconnect' : 'Connect'}
                    </button>
                </SettingRow>
            ))}
        </Section>
    );
}

/* ─── Help Tab ─────────────────────────────────────────────────────────────  */
const HELP_ITEMS = [
    { id: 'help-faq', label: 'FAQ', icon: HelpCircle, color: '#6366f1', sub: 'Browse frequently asked questions' },
    { id: 'help-support', label: 'Contact Support', icon: LifeBuoy, color: '#10b981', sub: 'Reach our support team 24/7' },
    { id: 'help-bug', label: 'Report a Bug', icon: Bug, color: '#ef4444', sub: "Found an issue? Let us know" },
    { id: 'help-feedback', label: 'Send Feedback', icon: MessageSquare, color: '#a855f7', sub: 'Help us improve SkillSync' },
];

function HelpTab() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HELP_ITEMS.map(h => (
                <button key={h.id} id={h.id}
                    className="flex items-center gap-4 p-5 glass border border-[var(--border-color)] rounded-2xl text-left hover:scale-[1.02] transition-all group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${h.color}15`, border: `1px solid ${h.color}28` }}>
                        <h.icon size={22} style={{ color: h.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[var(--text-primary)]">{h.label}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{h.sub}</p>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
            ))}
        </div>
    );
}

/* ─── About Tab ────────────────────────────────────────────────────────────  */
const ABOUT_ROWS = [
    { label: 'Version', value: '1.0.0 (Stable)', icon: SettingsIcon, color: '#6366f1' },
    { label: 'Built For', value: 'National Hackathon 2025', icon: Trophy, color: '#f59e0b' },
    { label: 'Tech Stack', value: 'React · Tailwind · Vite', icon: Layers, color: '#10b981' },
    { label: 'Team', value: 'Team SkillSync · VIT', icon: Users, color: '#a855f7' },
];

function AboutTab() {
    return (
        <div className="flex flex-col gap-4">
            <Section>
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 4px 18px rgba(99,102,241,0.4)' }}>
                        <Zap size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">SkillSync</h2>
                        <p className="text-xs text-[var(--text-muted)] font-medium">Version 1.0.0 · Build 2025.07.31</p>
                    </div>
                </div>
                <div className="flex flex-col gap-0">
                    {ABOUT_ROWS.map(r => (
                        <div key={r.label} className="flex items-center justify-between py-3 border-b border-[var(--border-color)] last:border-0">
                            <div className="flex items-center gap-2.5">
                                <r.icon size={14} style={{ color: r.color }} />
                                <span className="text-sm font-bold text-[var(--text-secondary)]">{r.label}</span>
                            </div>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{r.value}</span>
                        </div>
                    ))}
                </div>
            </Section>
            <div className="flex gap-3 flex-wrap">
                {['Terms & Conditions', 'Privacy Policy', 'Open Source Licenses'].map(l => (
                    <button key={l}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass border border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] hover:text-brand-400 hover:border-brand-500/30 transition-all">
                        <ExternalLink size={11} /> {l}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─── Tab Registry ───────────────────────────────────────────────────────── */
const TAB_CONTENT = {
    account: <AccountTab />,
    appearance: <AppearanceTab />,
    notifications: <NotificationsTab />,
    privacy: <PrivacyTab />,
    connected: <ConnectedTab />,
    help: <HelpTab />,
    about: <AboutTab />,
};

/* ─── Root Page ──────────────────────────────────────────────────────────── */
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');
    const [modal, setModal] = useState(null);

    return (
        <AppLayout pageTitle="Settings" activeNavId="settings">
            {/* Modals */}
            {modal === 'logout' && (
                <ConfirmModal
                    title="Sign Out"
                    message="Are you sure you want to sign out of your SkillSync account? Your data will be saved."
                    confirmLabel="Sign Out"
                    confirmColor="#ef4444"
                    onConfirm={() => setModal(null)}
                    onCancel={() => setModal(null)}
                />
            )}
            {modal === 'delete' && (
                <ConfirmModal
                    title="Delete Account"
                    message="This action is permanent. All your data, sessions, and achievements will be deleted forever and cannot be recovered."
                    confirmLabel="Delete My Account"
                    confirmColor="#dc2626"
                    onConfirm={() => setModal(null)}
                    onCancel={() => setModal(null)}
                />
            )}

            <div className="animate-fade-in pb-14" style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                            <SettingsIcon size={15} className="text-white" />
                        </div>
                        <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Account Center</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Settings</h1>
                    <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Manage your account, preferences, and privacy.</p>
                </div>

                {/* ── Layout ── */}
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* Left nav */}
                    <div className="lg:w-60 flex-shrink-0">
                        <div className="glass border border-[var(--border-color)] rounded-2xl p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible"
                            style={{ scrollbarWidth: 'none' }}>
                            {TABS.map(t => (
                                <button key={t.id} id={`settings-tab-${t.id}`}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left whitespace-nowrap transition-all flex-shrink-0 ${activeTab === t.id
                                        ? 'bg-brand-600 text-white shadow'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}>
                                    <t.icon size={15} className="flex-shrink-0" />
                                    <span className="text-xs font-bold hidden lg:block">{t.label}</span>
                                </button>
                            ))}
                            <div className="hidden lg:block border-t border-[var(--border-color)] mt-2 pt-2">
                                <button id="sidebar-logout"
                                    onClick={() => setModal('logout')}
                                    className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
                                    <LogOut size={15} className="flex-shrink-0" />
                                    <span className="text-xs font-bold">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-5">
                        {/* Active tab */}
                        <div key={activeTab} className="animate-fade-in">
                            {TAB_CONTENT[activeTab]}
                        </div>

                        {/* Danger Zone */}
                        <div className="glass border border-red-500/20 rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.03)' }}>
                            <h3 className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-red-400 mb-4">
                                <AlertTriangle size={14} /> Danger Zone
                            </h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-sm text-[var(--text-primary)]">Delete Account</p>
                                    <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                                        Permanently remove your account and all data. This cannot be undone.
                                    </p>
                                </div>
                                <button id="delete-account"
                                    onClick={() => setModal('delete')}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex-shrink-0">
                                    <Trash2 size={13} /> Delete Account
                                </button>
                            </div>
                        </div>

                        {/* Logout button */}
                        <button id="logout-btn"
                            onClick={() => setModal('logout')}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-white transition-all"
                            style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}>
                            <LogOut size={16} /> Sign Out of SkillSync
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
