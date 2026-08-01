import { createContext, useContext, useState } from 'react';

const RouterContext = createContext(null);

export function RouterProvider({ children }) {
    const [page, setPage] = useState('landing'); // 'landing' | 'login' | 'register'

    const navigate = (to) => {
        setPage(to);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <RouterContext.Provider value={{ page, navigate }}>
            {children}
        </RouterContext.Provider>
    );
}

export function useRouter() {
    const ctx = useContext(RouterContext);
    if (!ctx) throw new Error('useRouter must be inside <RouterProvider>');
    return ctx;
}
