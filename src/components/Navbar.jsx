import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Settings, Search, Menu, X, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import SearchBar from './SearchBar';
import Avatar from './Avatar';
import Badge from './Badge';
import Dropdown from './Dropdown';
import clsx from 'clsx';

const userMenuItems = [
    { value: 'profile', label: 'My Profile', icon: <span>👤</span> },
    { value: 'settings', label: 'Settings', icon: <Settings size={14} /> },
    { value: 'logout', label: 'Sign Out', icon: <span>🚪</span>, danger: true },
];

const API_BASE_URL = 'http://localhost:5000/api/v1';

const CATEGORY_EMOJI = {
    general: '📢',
    workshop: '🛠️',
    exam: '📝',
    placement: '💼',
    contest: '🏆',
};

export default function Navbar({ title = 'Dashboard', onMenuToggle, showMenuButton = false }) {
    const { isDark, toggleTheme } = useTheme();
    const { user, token, logout } = useAuth();
    const { navigate } = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);

    // Fetch latest announcements for notification bell
    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE_URL}/announcements`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setAnnouncements(data.data.slice(0, 6));
                }
            })
            .catch(() => {});
    }, [token]);

    const handleMenuClick = (val) => {
        if (val === 'logout') {
            logout();
            navigate('login');
        } else if (val === 'profile' || val === 'settings') {
            navigate(val);
        }
    };

    return (
        <header
            role="banner"
            className={clsx(
                'h-[64px] flex items-center justify-between px-4 md:px-6',
                'glass border-b border-[var(--border-color)] z-30 flex-shrink-0',
            )}
        >
            {/* Left: Menu toggle + Title */}
            <div className="flex items-center gap-3">
                {showMenuButton && (
                    <button
                        type="button"
                        aria-label="Toggle sidebar"
                        onClick={onMenuToggle}
                        className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-all md:hidden"
                    >
                        <Menu size={20} />
                    </button>
                )}
                <h1 className="text-base font-semibold text-[var(--text-primary)] hidden sm:block">
                    {title}
                </h1>
            </div>

            {/* Center: Search (md+) */}
            <div className="hidden md:flex flex-1 max-w-xs mx-6">
                <SearchBar
                    id="navbar-search"
                    placeholder="Search courses, skills, jobs…"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    onClear={() => setSearchValue('')}
                    className="w-full"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
                {/* Mobile search toggle */}
                <button
                    type="button"
                    aria-label="Open search"
                    onClick={() => setMobileSearchOpen(s => !s)}
                    className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-all"
                >
                    {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
                </button>

                {/* Theme toggle */}
                <button
                    type="button"
                    id="theme-toggle"
                    aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                    onClick={toggleTheme}
                    className={clsx(
                        'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                        'text-[var(--text-secondary)] hover:bg-white/5 hover:text-brand-400',
                    )}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        type="button"
                        id="notifications-btn"
                        aria-label={`Notifications (${announcements.length} unread)`}
                        onClick={() => setNotifOpen(s => !s)}
                        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-all"
                    >
                        <Bell size={18} />
                        {announcements.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                        <div className="absolute right-0 top-11 w-80 glass border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
                                <span className="text-sm font-extrabold text-[var(--text-primary)]">Announcements</span>
                                <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/20">{announcements.length} new</span>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {announcements.length === 0 ? (
                                    <p className="text-xs text-[var(--text-muted)] text-center py-6">No announcements yet.</p>
                                ) : announcements.map(a => (
                                    <button
                                        key={a._id}
                                        onClick={() => { setNotifOpen(false); navigate('announcements'); }}
                                        className="w-full text-left px-4 py-3 border-b border-[var(--border-color)]/50 hover:bg-white/[0.04] transition-colors flex gap-3 items-start"
                                    >
                                        <span className="text-base flex-shrink-0 mt-0.5">{CATEGORY_EMOJI[a.category] || '📢'}</span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{a.title}</p>
                                            <p className="text-[0.65rem] text-[var(--text-muted)] mt-0.5 line-clamp-1">{a.content}</p>
                                            <p className="text-[0.6rem] text-brand-400 font-semibold mt-0.5">By {a.createdBy?.fullName || 'Faculty'} · {a.category}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="px-4 py-2.5 border-t border-[var(--border-color)]">
                                <button onClick={() => { setNotifOpen(false); navigate('announcements'); }} className="text-xs font-bold text-brand-400 hover:underline">
                                    View all announcements →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User menu */}
                <Dropdown
                    align="right"
                    width="w-48"
                    items={userMenuItems}
                    onChange={handleMenuClick}
                    trigger={
                        <button
                            type="button"
                            id="user-menu-btn"
                            aria-label="User menu"
                            className="flex items-center gap-2 ml-1 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-all"
                        >
                            <Avatar name={user?.fullName || 'User'} size="sm" ring />
                            <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">
                                {user?.fullName?.split(' ')[0] || 'User'}
                            </span>
                        </button>
                    }
                />
            </div>

            {/* Mobile search bar (full-width overlay) */}
            {mobileSearchOpen && (
                <div className="absolute inset-x-0 top-[64px] p-3 glass border-b border-[var(--border-color)] md:hidden animate-fade-in z-40">
                    <SearchBar
                        id="mobile-search"
                        placeholder="Search courses, skills, jobs…"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        onClear={() => { setSearchValue(''); setMobileSearchOpen(false); }}
                        autoFocus
                        className="w-full"
                    />
                </div>
            )}
        </header>
    );
}
