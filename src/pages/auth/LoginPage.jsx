import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react'; // Google uses generic icon
import { useRouter } from '../../context/RouterContext';
import AuthLayout from './AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Card, CardBody } from '../../components/Card';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const { navigate } = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                // Update Context with user data & JWT
                login(data.data.user, data.data.token);
                // Redirect based on role
                const { role } = data.data.user;
                if (role === 'admin') navigate('admin');
                else if (role === 'faculty') navigate('faculty');
                else if (role === 'mentor') navigate('dashboard');
                else navigate('dashboard'); // student
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('Network error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem',
                        color: 'var(--text-primary)', letterSpacing: '-0.02em',
                    }}>
                        Welcome back to SkillSync
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                        Log in to continue building your skills.
                    </p>
                </div>

                <Card variant="glass" padding="md">
                    <CardBody>
                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem', borderRadius: '10px',
                                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}>
                                <span aria-hidden="true">⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <Input
                                label="College Email"
                                id="login-email"
                                type="email"
                                placeholder="student@university.edu"
                                value={email}
                                leftIcon={<Mail size={16} />}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Input
                                        label="Password"
                                        id="login-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        leftIcon={<Lock size={16} />}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        fullWidth
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                    <input type="checkbox" style={{
                                        width: '16px', height: '16px', borderRadius: '4px',
                                        border: '1px solid var(--border-color)', background: 'var(--bg-elevated)',
                                        accentColor: '#6366f1', cursor: 'pointer',
                                    }} />
                                    Remember me
                                </label>
                                <a href="#" onClick={e => e.preventDefault()} style={{
                                    color: '#818cf8', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#c084fc'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                fullWidth
                                loading={loading}
                                rightIcon={<ArrowRight size={16} />}
                                style={{ marginTop: '0.5rem' }}
                            >
                                Sign In to Platform
                            </Button>
                        </form>

                        <div style={{
                            display: 'flex', alignItems: 'center', margin: '2rem 0',
                            color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600,
                        }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                            <span style={{ padding: '0 0.75rem' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                        </div>

                        <Button
                            variant="outline"
                            size="md"
                            fullWidth
                            leftIcon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chrome">
                                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" x2="12" y1="8" y2="8" /><line x1="3.95" x2="8.54" y1="6.06" y2="14" /><line x1="10.88" x2="15.46" y1="21.94" y2="14" />
                                </svg>
                            }
                            onClick={() => { }}
                        >
                            Continue with Google
                        </Button>

                        <p style={{
                            textAlign: 'center', margin: '2rem 0 0', fontSize: '0.9375rem', color: 'var(--text-secondary)',
                        }}>
                            Don't have an account?{' '}
                            <a href="#" onClick={e => { e.preventDefault(); navigate('register'); }} style={{
                                color: '#6366f1', textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                                onMouseLeave={e => e.currentTarget.style.color = '#6366f1'}
                            >
                                Sign up
                            </a>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </AuthLayout>
    );
}
