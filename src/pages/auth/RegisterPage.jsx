import { useState } from 'react';
import { User, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import { Card, CardBody } from '../../components/Card';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const DEPARTMENTS = [
    { value: 'CSE', label: 'Computer Science (CSE)' },
    { value: 'IT', label: 'Information Technology (IT)' },
    { value: 'AIDS', label: 'AI & Data Science (AIDS)' },
    { value: 'ECE', label: 'Electronics & Comm (ECE)' },
    { value: 'EEE', label: 'Electrical Eng (EEE)' },
    { value: 'MECH', label: 'Mechanical Eng (MECH)' },
    { value: 'CIVIL', label: 'Civil Eng (CIVIL)' },
    { value: 'OTHER', label: 'Other Department' },
];

const YEARS = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
];

const ROLES = [
    { value: 'user', label: 'Student / Peer Learner' },
    { value: 'faculty', label: 'Faculty' },
];

export default function RegisterPage() {
    const { navigate } = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: 'CSE',
        year: '1',
        role: 'user',
        password: '',
        confirm: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target ? e.target.value : e }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.name.trim()) {
            setError('Please enter your full name.');
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            setError('Please provide a valid email address.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (formData.password !== formData.confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    department: formData.department,
                    year: Number(formData.year),
                    role: formData.role
                })
            });

            const data = await res.json();

            if (data.success && data.data) {
                // Log user in and save to Context / localStorage
                login(data.data.user, data.data.token);

                // Redirect user based on registered role
                const userRole = data.data.user.role;
                if (userRole === 'faculty') navigate('faculty');
                else if (userRole === 'admin') navigate('admin');
                else navigate('dashboard');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Failed to connect to backend server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.25rem 0.75rem', borderRadius: '999px',
                        background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)',
                        color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem'
                    }}>
                        <Sparkles size={14} /> Join 500+ Students & Mentors
                    </div>
                    <h2 style={{
                        fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem',
                        color: 'var(--text-primary)', letterSpacing: '-0.02em',
                    }}>
                        Create your account
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                        Start your peer skill-exchange journey today.
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
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <Input
                                label="Full Name"
                                id="reg-name"
                                placeholder="Alex Kumar"
                                value={formData.name}
                                onChange={handleChange('name')}
                                leftIcon={<User size={16} />}
                                required
                            />

                            <Input
                                label="College Email"
                                id="reg-email"
                                type="email"
                                placeholder="student@university.edu"
                                value={formData.email}
                                onChange={handleChange('email')}
                                leftIcon={<Mail size={16} />}
                                required
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Dropdown
                                    label="Department"
                                    id="reg-dept"
                                    placeholder="Department"
                                    value={formData.department}
                                    onChange={v => handleChange('department')(v)}
                                    items={DEPARTMENTS}
                                    width="w-full"
                                />

                                <Dropdown
                                    label="Year"
                                    id="reg-year"
                                    placeholder="Year"
                                    value={formData.year}
                                    onChange={v => handleChange('year')(v)}
                                    items={YEARS}
                                    width="w-full"
                                />
                            </div>

                            <Dropdown
                                label="Role"
                                id="reg-role"
                                placeholder="Select Role"
                                value={formData.role}
                                onChange={v => handleChange('role')(v)}
                                items={ROLES}
                                width="w-full"
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="Password"
                                    id="reg-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    leftIcon={<Lock size={16} />}
                                    required
                                />
                                <Input
                                    label="Confirm"
                                    id="reg-confirm"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirm}
                                    onChange={handleChange('confirm')}
                                    leftIcon={<Lock size={16} />}
                                    error={
                                        formData.confirm && formData.password !== formData.confirm
                                            ? "Passwords don't match"
                                            : null
                                    }
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                fullWidth
                                loading={loading}
                                style={{ marginTop: '0.5rem' }}
                            >
                                Create Account & Save
                            </Button>
                        </form>

                        <p style={{
                            textAlign: 'center', margin: '2rem 0 0', fontSize: '0.9375rem', color: 'var(--text-secondary)',
                        }}>
                            Already have an account?{' '}
                            <a href="#" onClick={e => { e.preventDefault(); navigate('login'); }} style={{
                                color: '#6366f1', textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                                onMouseLeave={e => e.currentTarget.style.color = '#6366f1'}
                            >
                                Sign in
                            </a>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </AuthLayout>
    );
}
