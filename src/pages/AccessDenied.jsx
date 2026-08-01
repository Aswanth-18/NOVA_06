import AppLayout from '../components/AppLayout';
import Button from '../components/Button';
import { useRouter } from '../context/RouterContext';

export default function AccessDenied() {
    const { navigate } = useRouter();

    return (
        <AppLayout pageTitle="Access Denied" activeNavId="">
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-red-500/10 border-2 border-red-500/20 mb-6">
                    <span className="text-4xl text-red-400 font-extrabold">403</span>
                </div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h1>
                <p className="text-[var(--text-secondary)] max-w-sm mb-6">
                    You do not have permission to view this page. If you believe this is an error, contact your administrator.
                </p>
                <Button onClick={() => navigate('landing')} variant="primary">
                    Return to Home
                </Button>
            </div>
        </AppLayout>
    );
}
