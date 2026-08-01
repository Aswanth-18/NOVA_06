import { useState, useEffect } from 'react';
import {
    Award, ShieldCheck, HeartPulse, GraduationCap, Briefcase,
    CheckCircle2, Plus, Minus, Target, Clock,
    ArrowRight, ArrowLeft, Lightbulb, Play, AlertCircle, Loader
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function BecomeMentorPage() {
    const { navigate } = useRouter();
    const { token, user } = useAuth();
    const { toast } = useToast();

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [expandedFaq, setExpandedFaq] = useState(0);

    const [statusData, setStatusData] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);

    // Dynamic skill list from the database
    const [availableSkills, setAvailableSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);

    const BENEFITS = [
        { title: 'Earn XP & Badges', icon: Award, color: '#f59e0b', desc: 'Gain exclusive badges and level up your profile.' },
        { title: 'Build Leadership', icon: Target, color: '#ec4899', desc: 'Enhance your soft skills and leadership qualities.' },
        { title: 'Boost Resume', icon: Briefcase, color: '#3b82f6', desc: 'Showcase practical teaching and mentoring experience.' },
        { title: 'Community Impact', icon: HeartPulse, color: '#ef4444', desc: 'Help peers succeed and grow your network.' },
        { title: 'Faculty Recognition', icon: GraduationCap, color: '#10b981', desc: 'Get officially recognized by your college professors.' }
    ];

    const FAQS = [
        { q: 'How do I apply as a mentor?', a: 'To apply as a mentor, select the skills you want to teach, pass a 20-question assessment with at least 70% score, and receive verification from a Faculty member.' },
        { q: 'What topics are covered in the assessment?', a: 'The 20 MCQ questions cover 6 topics: Java, Python, DBMS, OOP, Aptitude, and Communication Skills.' },
        { q: 'What happens if I score below 70%?', a: 'If your score is below 70%, the assessment fails. You can retake the assessment after a 24-hour cooldown period.' },
        { q: 'Does passing the test immediately change my role?', a: 'No. Passing the test creates a Mentor Application per skill with status "Pending Faculty Approval". Only a Faculty member can approve each skill individually.' },
        { q: 'Can I be a mentor for some skills and a learner for others?', a: 'Yes! Mentor status is per-skill. You can be an approved mentor for Java while still learning React as a student.' }
    ];

    // ── Fetch active skills from the database ──────────────────────────────────
    useEffect(() => {
        const fetchSkills = async () => {
            setLoadingSkills(true);
            try {
                const res = await fetch(`${API_BASE_URL}/skills`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    // Only show active skills
                    const active = data.data
                        .filter(s => s.isActive !== false && s.status !== 'Inactive')
                        .map(s => s.skillName);
                    setAvailableSkills(active);
                } else {
                    // Fallback list if API fails
                    setAvailableSkills(['Java', 'Python', 'React', 'SQL', 'DBMS', 'OOP', 'Aptitude', 'Communication']);
                }
            } catch {
                setAvailableSkills(['Java', 'Python', 'React', 'SQL', 'DBMS', 'OOP', 'Aptitude', 'Communication']);
            } finally {
                setLoadingSkills(false);
            }
        };
        fetchSkills();
    }, [token]);

    // ── Fetch application status from backend ──────────────────────────────────
    useEffect(() => {
        const checkStatus = async () => {
            if (!token) { setLoadingStatus(false); return; }
            try {
                const res = await fetch(`${API_BASE_URL}/mentor/my-status`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setStatusData(data.data);
            } catch (err) {
                console.error('Status fetch error:', err);
            } finally {
                setLoadingStatus(false);
            }
        };
        checkStatus();
    }, [token]);

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleStartAssessment = () => {
        if (selectedSkills.length === 0) {
            toast({
                variant: 'warning',
                title: 'No Skills Selected',
                message: 'Please select at least one skill you want to teach before starting the assessment.',
            });
            return;
        }

        if (statusData && !statusData.canApply && statusData.hasPending) {
            toast({
                variant: 'info',
                title: 'Application Pending',
                message: 'You already have an application Pending Faculty Approval.',
            });
            return;
        }

        if (statusData && !statusData.canRetake && statusData.hoursRemaining > 0) {
            toast({
                variant: 'warning',
                title: 'Retake Cooldown Active',
                message: `You can retake the assessment after 24 hours (${statusData.hoursRemaining} hours remaining).`,
            });
            return;
        }

        // ── Persist selected skills so MentorAssessmentPage can submit them ──
        try {
            localStorage.setItem('mentorApplication_selectedSkills', JSON.stringify(selectedSkills));
        } catch {
            sessionStorage.setItem('mentorApplication_selectedSkills', JSON.stringify(selectedSkills));
        }

        navigate('mentor-assessment');
    };

    // Check if a skill already has an approved or pending application
    const getSkillApplicationStatus = (skill) => {
        if (!statusData?.mentorSkills) return null;
        return statusData.mentorSkills.find(ms =>
            ms.skillName?.toLowerCase() === skill.toLowerCase()
        ) || null;
    };

    return (
        <AppLayout pageTitle="Apply as Mentor" activeNavId="mentor">
            <div className="animate-fade-in flex flex-col gap-8 pb-12" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-1">Apply as Mentor</h1>
                        <p className="text-[var(--text-secondary)] text-base">Select skills to teach, pass the qualification assessment, and get faculty approval per skill.</p>
                    </div>

                    {user?.isVerifiedMentor ? (
                        <Badge variant="success" size="lg">✅ Verified Mentor</Badge>
                    ) : statusData?.hasPending ? (
                        <Badge variant="warning" size="lg">⏳ Pending Faculty Approval</Badge>
                    ) : null}
                </div>

                {/* Status Notice — Pending */}
                {statusData?.hasPending && (
                    <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 flex items-center gap-3">
                        <Clock size={24} className="flex-shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Application(s) Submitted — Pending Faculty Approval</p>
                            <p className="text-xs text-amber-200">
                                {statusData.mentorSkills?.filter(ms => ms.status === 'pending').map(ms => ms.skillName).join(', ')} — a Faculty member will review your application(s) shortly.
                            </p>
                        </div>
                    </div>
                )}

                {/* Status Notice — Cooldown */}
                {statusData && !statusData.canRetake && statusData.hoursRemaining > 0 && !statusData.hasPending && (
                    <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 flex items-center gap-3">
                        <AlertCircle size={24} className="flex-shrink-0" />
                        <div>
                            <p className="font-bold text-sm">24-Hour Retake Cooldown Active</p>
                            <p className="text-xs text-red-200">Your previous score was below 70%. You can retake the assessment in {statusData.hoursRemaining} hours.</p>
                        </div>
                    </div>
                )}

                {/* Hero Banner */}
                <Card variant="glass" className="overflow-hidden border border-brand-500/30 relative shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-purple-600/20 to-transparent pointer-events-none" />
                    <CardBody className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 flex flex-col items-start gap-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold text-sm tracking-wide">
                                <Lightbulb size={16} /> Empower Others
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                Transform your expertise into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">meaningful impact.</span>
                            </h2>
                            <p className="text-gray-300 max-w-lg leading-relaxed">
                                Join our elite group of student mentors. Guide your peers through complex subjects while building your own leadership skills and professional network. Mentor status is granted <strong>per skill</strong> — you can teach Java and still learn React!
                            </p>
                            <Button
                                variant="primary"
                                onClick={handleStartAssessment}
                                disabled={statusData?.hasPending || (statusData && !statusData.canRetake && statusData.hoursRemaining > 0)}
                                leftIcon={<Play size={18} fill="currentColor" />}
                            >
                                {statusData?.hasPending ? 'Pending Faculty Review' : statusData && !statusData.canRetake ? `Retake in ${statusData.hoursRemaining}h` : 'Start Your Mentor Journey'}
                            </Button>
                        </div>
                        <div className="hidden md:flex w-52 h-52 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />
                            <div className="w-full h-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-2xl rotate-3 shadow-xl flex items-center justify-center p-6 relative z-10">
                                <GraduationCap size={80} className="text-purple-400" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center z-20 backdrop-blur-sm -rotate-6">
                                <ShieldCheck size={28} className="text-blue-400" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Mentor Benefits */}
                <div className="flex flex-col gap-4 mt-2">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Why apply as a mentor?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {BENEFITS.map((benefit, i) => (
                            <Card key={i} variant="glass" className="hover:-translate-y-1 transition-transform duration-300">
                                <CardBody className="p-5 flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-1" style={{ background: `${benefit.color}15`, color: benefit.color }}>
                                        <benefit.icon size={24} />
                                    </div>
                                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{benefit.title}</h4>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{benefit.desc}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Eligibility Rules */}
                        <Card variant="glass">
                            <CardHeader title="Eligibility Rules & Assessment Guidelines" />
                            <CardBody className="pt-0 flex flex-col gap-3">
                                {[
                                    '20 Multiple Choice Questions covering Java, Python, DBMS, OOP, Aptitude, & Communication Skills',
                                    'Passing Score: 70% or above (at least 14 out of 20 marks)',
                                    'Timed Assessment (20 Minutes total with live countdown timer)',
                                    'Failed Assessment (<70%): Cooldown of 24 hours before retaking',
                                    'Passed Assessment (≥70%): Creates Mentor Application per skill with status "Pending Faculty Approval"',
                                    'Faculty approves or rejects EACH SKILL individually — approval is per-skill, not per-account'
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-xl">
                                        <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 size={14} className="text-brand-400" />
                                        </div>
                                        <span className="text-sm font-medium text-[var(--text-primary)]">{rule}</span>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>

                        {/* Choose Skills to Teach */}
                        <Card variant="glass">
                            <CardHeader title="Choose Skills to Teach" />
                            <CardBody className="pt-0 flex flex-col gap-4">
                                <p className="text-xs text-[var(--text-muted)]">
                                    Select the skills you want to apply to teach. You'll be assessed on all topics regardless of selection — your selection determines which skills get submitted for faculty approval after you pass.
                                </p>
                                {loadingSkills ? (
                                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                                        <Loader size={16} className="animate-spin" /> Loading skills from database...
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {availableSkills.map(skill => {
                                            const isSelected = selectedSkills.includes(skill);
                                            const appStatus = getSkillApplicationStatus(skill);
                                            const isApproved = appStatus?.status === 'approved';
                                            const isPending = appStatus?.status === 'pending';

                                            return (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => !isApproved && !isPending && toggleSkill(skill)}
                                                    disabled={isApproved || isPending}
                                                    title={
                                                        isApproved ? `You are already an approved mentor for ${skill}` :
                                                        isPending ? `Your ${skill} application is pending faculty review` :
                                                        `Click to ${isSelected ? 'remove' : 'select'} ${skill}`
                                                    }
                                                    className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center gap-2
                                                        ${isApproved
                                                            ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 cursor-not-allowed'
                                                            : isPending
                                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-not-allowed'
                                                            : isSelected
                                                            ? 'bg-brand-600 border-brand-500 text-white shadow-md'
                                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-gray-500'}`}
                                                >
                                                    {skill}
                                                    {isApproved && <CheckCircle2 size={14} className="text-emerald-400" />}
                                                    {isPending && <Clock size={14} className="text-amber-400" />}
                                                    {isSelected && !isApproved && !isPending && <CheckCircle2 size={16} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                {selectedSkills.length > 0 && (
                                    <p className="text-xs text-brand-400 font-semibold">
                                        ✓ {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected: {selectedSkills.join(', ')}
                                    </p>
                                )}
                            </CardBody>
                        </Card>

                        {/* FAQs */}
                        <div className="mt-4">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Frequently Asked Questions</h3>
                            <div className="flex flex-col gap-3">
                                {FAQS.map((faq, idx) => (
                                    <div key={idx} className="border border-[var(--border-color)] rounded-xl bg-[rgba(255,255,255,0.01)] overflow-hidden">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                                            className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
                                        >
                                            <span className="font-bold text-[var(--text-primary)] text-sm">{faq.q}</span>
                                            {expandedFaq === idx ? <Minus size={18} className="text-brand-400" /> : <Plus size={18} className="text-[var(--text-muted)]" />}
                                        </button>
                                        {expandedFaq === idx && (
                                            <div className="p-4 pt-0 text-[0.9rem] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/50 mt-2">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="flex flex-col gap-6 relative">
                        <div className="sticky top-6 flex flex-col gap-6">

                            {/* Summary Card */}
                            <Card variant="elevated" className="border-brand-500/20 overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-500" />
                                <CardHeader title="Application Summary" />
                                <CardBody className="pt-0 flex flex-col gap-4 relative z-10">
                                    <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-3">
                                        <span className="text-sm font-medium text-[var(--text-muted)]">Selected Skills</span>
                                        <span className="text-sm font-bold text-[var(--text-primary)] text-right max-w-[140px]">
                                            {selectedSkills.length > 0 ? selectedSkills.join(', ') : <span className="italic text-gray-500">None selected</span>}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-[var(--border-color)] pb-3">
                                        <span className="text-sm font-medium text-[var(--text-muted)]">Passing Threshold</span>
                                        <span className="text-sm font-bold text-emerald-400">70% (14/20 Marks)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[var(--border-color)] pb-3">
                                        <span className="text-sm font-medium text-[var(--text-muted)]">Assessment Duration</span>
                                        <span className="text-sm font-bold text-[var(--text-primary)]">20 Minutes</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[var(--border-color)] pb-3">
                                        <span className="text-sm font-medium text-[var(--text-muted)]">Approval Type</span>
                                        <span className="text-sm font-bold text-purple-400">Per-Skill by Faculty</span>
                                    </div>

                                    <div className="flex flex-col gap-3 mt-2">
                                        <Button
                                            variant="primary"
                                            onClick={handleStartAssessment}
                                            disabled={
                                                selectedSkills.length === 0 ||
                                                statusData?.hasPending ||
                                                (statusData && !statusData.canRetake && statusData.hoursRemaining > 0)
                                            }
                                            rightIcon={<ArrowRight size={18} />}
                                            className="w-full py-3.5"
                                        >
                                            {selectedSkills.length === 0
                                                ? 'Select Skills First'
                                                : statusData?.hasPending
                                                ? 'Pending Approval'
                                                : 'Start Assessment'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('dashboard')}
                                            leftIcon={<ArrowLeft size={16} />}
                                            className="w-full py-3"
                                        >
                                            Back to Dashboard
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Timeline */}
                            <Card variant="glass">
                                <CardHeader title="Mentor Journey Timeline" />
                                <CardBody className="pt-0">
                                    <div className="flex flex-col gap-5 relative pl-3">
                                        <div className="absolute left-[17px] top-2 bottom-4 w-px bg-[var(--border-color)]" />

                                        {[
                                            { title: 'Select skills to teach', active: selectedSkills.length > 0 },
                                            { title: 'Pass 20 MCQ Assessment (≥70%)', active: false },
                                            { title: 'Faculty Review & Per-Skill Verification', active: statusData?.hasPending },
                                            { title: 'Receive Verified Mentor Status per Skill', active: user?.isVerifiedMentor }
                                        ].map((step, idx) => (
                                            <div key={idx} className="flex gap-4 relative z-10">
                                                <div className={`w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0 ${step.active ? 'bg-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-gray-600 border-2 border-[var(--bg-base)]'}`} />
                                                <div>
                                                    <p className={`text-sm font-bold ${step.active ? 'text-brand-400' : 'text-[var(--text-secondary)]'}`}>{idx + 1}. {step.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>

                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
