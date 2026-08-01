import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import clsx from 'clsx';
import { useRouter } from '../context/RouterContext';

export default function AppLayout({ children, pageTitle = 'SkillSync', activeNavId }) {
    const { navigate } = useRouter();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleNavigate = (id) => {
        // If routes match the string exactly
        navigate(id);
        setMobileSidebarOpen(false);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar activeId={activeNavId} onNavigate={handleNavigate} />
            </div>

            {/* Mobile Sidebar overlay */}
            {mobileSidebarOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        aria-hidden="true"
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="fixed inset-y-0 left-0 z-50 md:hidden animate-slide-left">
                        <Sidebar
                            activeId={activeNavId}
                            onNavigate={handleNavigate}
                        />
                    </div>
                </>
            )}

            {/* Main area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Navbar
                    title={pageTitle}
                    onMenuToggle={() => setMobileSidebarOpen(s => !s)}
                    showMenuButton={true}
                />

                {/* Ambient background glow */}
                <div
                    aria-hidden="true"
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(99,102,241,0.1) 0%, transparent 80%),' +
                            'radial-gradient(ellipse 40% 30% at 80% 80%, rgba(168,85,247,0.07) 0%, transparent 70%)',
                    }}
                />

                <main
                    id="main-content"
                    tabIndex={-1}
                    role="main"
                    aria-label="Main content"
                    className={clsx(
                        'flex-1 overflow-y-auto relative z-10',
                        'p-4 md:p-6 lg:p-8',
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
