import { useState } from 'react';
import {
    LayoutDashboard, ShoppingBag, ShieldCheck, CalendarCheck,
    MessageCircle, Trophy, User, GraduationCap, ShieldAlert,
    Settings, Zap, ChevronLeft, ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import Badge from './Badge';

import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeId = 'dashboard', onNavigate, defaultCollapsed = false }) {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    // Build sidebar dynamically based on user.role
    const role = user?.role || 'user';
    let allowedItems = [];

    if (role === 'user' || role === 'student' || role === 'mentor') {
        allowedItems = [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'skills', label: 'Skill Management', icon: ShoppingBag },
            { id: 'mentor', label: 'Apply as Mentor', icon: ShieldCheck },
            { id: 'bookings', label: 'My Bookings', icon: CalendarCheck },
        ];

        if (user?.isVerifiedMentor) {
            allowedItems.push({ id: 'students', label: 'My Students', icon: User });
        }

        allowedItems.push(
            { id: 'messages', label: 'Messages', icon: MessageCircle },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'profile', label: 'Profile', icon: User }
        );
    } else if (role === 'faculty') {
        allowedItems = [
            { id: 'faculty', label: 'Faculty Dashboard', icon: GraduationCap },
            { id: 'skills', label: 'Skill Management', icon: ShoppingBag },
            { id: 'reports', label: 'Reports', icon: LayoutDashboard },
            { id: 'announcements', label: 'Announcements', icon: MessageCircle },
            { id: 'profile', label: 'Profile', icon: User },
        ];
    } else if (role === 'admin') {
        allowedItems = [
            { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert },
            { id: 'students-admin', label: 'Students', icon: User },
            { id: 'mentors-admin', label: 'Mentors', icon: ShieldCheck },
            { id: 'faculty-admin', label: 'Faculty', icon: GraduationCap },
            { id: 'skills', label: 'Skill Management', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
            { id: 'reports', label: 'Reports', icon: Trophy },
            { id: 'announcements', label: 'Announcements', icon: MessageCircle },
            { id: 'settings', label: 'Settings', icon: Settings },
        ];
    }

    const NAV_ITEMS = [{ group: 'Menu', items: allowedItems }];

    return (
        <aside
            aria-label="Sidebar navigation"
            className={clsx(
                'relative flex flex-col h-full glass border-r border-[var(--border-color)]',
                'sidebar-transition overflow-hidden z-20',
                collapsed ? 'w-[68px]' : 'w-[240px]',
            )}
        >
            {/* Brand */}
            <div className={clsx(
                'flex items-center h-[64px] px-4 border-b border-[var(--border-color)] flex-shrink-0',
                collapsed ? 'justify-center' : 'gap-3',
            )}>
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(99,102,241,0.5)]">
                    <Zap size={16} className="text-white" aria-hidden="true" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-base gradient-brand-text tracking-tight whitespace-nowrap overflow-hidden">
                        SkillSync
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav
                role="navigation"
                aria-label="Main navigation"
                className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-5"
            >
                {NAV_ITEMS.map(group => (
                    <div key={group.group}>
                        {!collapsed && (
                            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">
                                {group.group}
                            </p>
                        )}
                        {collapsed && <div className="border-t border-[var(--border-color)] mb-2 mx-1" />}

                        <ul role="list" className="flex flex-col gap-0.5">
                            {group.items.map(item => {
                                const Icon = item.icon;
                                const active = item.id === activeId;

                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            id={`nav-${item.id}`}
                                            aria-current={active ? 'page' : undefined}
                                            aria-label={collapsed ? item.label : undefined}
                                            title={collapsed ? item.label : undefined}
                                            onClick={() => onNavigate?.(item.id)}
                                            className={clsx(
                                                'flex items-center gap-3 w-full rounded-lg px-3 py-2.5',
                                                'transition-all duration-150 text-sm font-medium',
                                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500',
                                                collapsed && 'justify-center px-0',
                                                active
                                                    ? 'gradient-brand text-white shadow-[0_2px_12px_rgba(99,102,241,0.4)]'
                                                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]',
                                            )}
                                        >
                                            <Icon size={18} aria-hidden="true" className="flex-shrink-0" />
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1 text-left truncate">{item.label}</span>
                                                    {item.badge && (
                                                        <Badge variant={item.badge.variant} size="sm">
                                                            {item.badge.text}
                                                        </Badge>
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* User profile stub */}
            {!collapsed && user && (
                <div className="flex items-center gap-3 p-4 border-t border-[var(--border-color)] flex-shrink-0">
                    <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.fullName}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate capitalize">{user.role}</p>
                    </div>
                    <Badge variant="accent" size="sm" dot>Live</Badge>
                </div>
            )}

            {/* Collapse toggle */}
            <button
                type="button"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setCollapsed(s => !s)}
                className={clsx(
                    'absolute top-[76px] -right-3 w-6 h-6 rounded-full',
                    'glass border border-[var(--border-color)]',
                    'flex items-center justify-center',
                    'text-[var(--text-secondary)] hover:text-brand-400',
                    'transition-all duration-200 hover:border-brand-500/50 z-30',
                )}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
        </aside>
    );
}
