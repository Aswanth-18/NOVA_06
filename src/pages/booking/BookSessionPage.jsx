import { useState, useEffect, useCallback } from 'react';
import {
    Calendar as CalendarIcon, Clock, Video, MapPin,
    CheckCircle2, ArrowRight, X, Star, ChevronLeft, ChevronRight, Check,
    AlertCircle, RefreshCw, BookOpen, User
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '04:00 PM',
    '05:00 PM'
];

export default function BookSessionPage() {
    const { navigate } = useRouter();
    const { token, user } = useAuth();
    const { toast } = useToast();

    // Mentors list state
    const [mentors, setMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(true);
    const [selectedMentorId, setSelectedMentorId] = useState('');

    // Booking form state
    const [skillName, setSkillName] = useState('');
    const [scheduledDate, setScheduledDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [scheduledTime, setScheduledTime] = useState('11:00 AM');
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch verified mentors — re-fetch when skillName changes
    const fetchVerifiedMentors = useCallback(async (skill) => {
        setLoadingMentors(true);
        setMentors([]);
        try {
            let verifiedList = [];

            if (skill && skill.trim().length > 1) {
                // Fetch mentors approved specifically for this skill
                const res = await fetch(
                    `${API_BASE_URL}/mentor/mentors-for-skill?skill=${encodeURIComponent(skill.trim())}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    verifiedList = data.data.filter(m => m._id !== user?._id);
                }
            } else {
                // No skill entered — show all users with isVerifiedMentor=true
                const res = await fetch(`${API_BASE_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    verifiedList = data.data.filter(u => u.isVerifiedMentor && u._id !== user?._id);
                }
            }

            setMentors(verifiedList);
            if (verifiedList.length > 0) {
                setSelectedMentorId(verifiedList[0]._id);
            } else {
                setSelectedMentorId('');
            }
        } catch (err) {
            console.error('Fetch mentors error:', err);
        } finally {
            setLoadingMentors(false);
        }
    }, [token, user?._id]);

    useEffect(() => {
        fetchVerifiedMentors(skillName);
    }, [fetchVerifiedMentors, skillName]);

    const selectedMentor = mentors.find(m => m._id === selectedMentorId) || mentors[0];

    const handleSubmitBooking = async (e) => {
        e.preventDefault();

        if (user?.role === 'faculty' || user?.role === 'admin') {
            toast({
                variant: 'error',
                title: 'Permission Denied',
                message: 'Faculty and Admin members cannot create session bookings.',
            });
            return;
        }

        if (!selectedMentorId) {
            toast({ variant: 'error', title: 'Selection Error', message: 'Please select a verified mentor.' });
            return;
        }
        if (!skillName.trim()) {
            toast({ variant: 'error', title: 'Input Error', message: 'Please enter or select a skill.' });
            return;
        }
        if (!scheduledDate) {
            toast({ variant: 'error', title: 'Input Error', message: 'Please select a scheduled date.' });
            return;
        }
        if (!topic.trim()) {
            toast({ variant: 'error', title: 'Input Error', message: 'Please enter a session topic or doubt.' });
            return;
        }

        // Frontend validation: check past date
        const selectedD = new Date(scheduledDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkD = new Date(selectedD);
        checkD.setHours(0, 0, 0, 0);

        if (checkD < today) {
            toast({
                variant: 'error',
                title: 'Invalid Date',
                message: 'Booking cannot be created for a past date.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mentorId: selectedMentorId,
                    skillName,
                    scheduledDate,
                    scheduledTime,
                    topic,
                    notes
                })
            });

            const data = await res.json();

            if (data.success) {
                toast({
                    variant: 'success',
                    title: 'Booking Request Submitted 🎉',
                    message: `Booking request sent to ${selectedMentor?.fullName || 'Mentor'}. Status: Pending`,
                });
                navigate('bookings');
            } else {
                toast({
                    variant: 'error',
                    title: 'Booking Failed',
                    message: data.message || 'Could not submit booking request.',
                });
            }
        } catch (err) {
            console.error('Submit booking error:', err);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to connect to backend server.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout pageTitle="Book Session" activeNavId="marketplace">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-8 pb-10 relative" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] my-0 mb-1">Book a Mentoring Session</h1>
                        <p className="text-[var(--text-secondary)] text-[0.95rem] font-medium">Schedule a 1-on-1 skill exchange session with a verified mentor.</p>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

                    {/* LEFT COLUMN - Booking Form */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Select Verified Mentor */}
                        <Card variant="glass" className="overflow-hidden relative border border-[var(--border-color)]">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-400 to-purple-500" />
                            <CardBody className="p-5 flex flex-col gap-4 pl-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                        <User size={20} className="text-brand-400" /> Select Verified Mentor
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={fetchVerifiedMentors} leftIcon={<RefreshCw size={14} className={loadingMentors ? 'animate-spin' : ''} />}>
                                        Refresh Mentors
                                    </Button>
                                </div>

                                {loadingMentors ? (
                                    <div className="p-4 bg-white/5 rounded-xl animate-pulse h-20"></div>
                                ) : mentors.length > 0 ? (
                                    <select
                                        value={selectedMentorId}
                                        onChange={e => setSelectedMentorId(e.target.value)}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] text-sm font-semibold outline-none focus:border-brand-500"
                                    >
                                        {mentors.map(m => (
                                            <option key={m._id} value={m._id} className="bg-gray-800 text-white">
                                                {m.fullName} ({m.department || 'CSE'}) — Verified Mentor
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                                        No verified mentors currently listed in backend. You can enter mentor ID or select from system.
                                    </div>
                                )}

                                {selectedMentor && (
                                    <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-xl mt-1">
                                        <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 font-extrabold flex items-center justify-center">
                                            {selectedMentor.fullName ? selectedMentor.fullName.charAt(0).toUpperCase() : 'M'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[var(--text-primary)]">{selectedMentor.fullName}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{selectedMentor.department} · {selectedMentor.email}</p>
                                        </div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Booking Form */}
                        <form onSubmit={handleSubmitBooking} className="flex flex-col gap-6">

                            {/* Step 1: Session & Skill Details */}
                            <Card variant="glass">
                                <CardHeader title="1. Session & Skill Details" />
                                <CardBody className="pt-0 flex flex-col gap-4">

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[var(--text-primary)]">
                                            Skill Name <span className="text-red-400">*</span>
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. React, Python, Java, Figma, SQL"
                                            value={skillName}
                                            onChange={e => setSkillName(e.target.value)}
                                            required
                                        />
                                    </div>

                                </CardBody>
                            </Card>

                            {/* Step 2: Date & Time */}
                            <Card variant="glass">
                                <CardHeader title="2. Date & Time" />
                                <CardBody className="pt-0 flex flex-col gap-6">

                                    {/* Scheduled Date */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[var(--text-primary)]">
                                            Scheduled Date <span className="text-red-400">*</span>
                                        </label>
                                        <Input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={scheduledDate}
                                            onChange={e => setScheduledDate(e.target.value)}
                                            required
                                        />
                                        <span className="text-xs text-[var(--text-muted)]">* Booking cannot be created for a past date.</span>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-bold text-[var(--text-primary)]">Select Time Slot</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {TIME_SLOTS.map((t, i) => (
                                                <button
                                                    type="button"
                                                    key={i}
                                                    onClick={() => setScheduledTime(t)}
                                                    className={`py-2.5 rounded-lg border text-sm font-bold transition-all ${scheduledTime === t ? 'bg-brand-600 border-brand-500 text-white shadow-md' : 'bg-[rgba(255,255,255,0.02)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-gray-500'}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                </CardBody>
                            </Card>

                            {/* Step 3: Session Topic & Notes */}
                            <Card variant="glass">
                                <CardHeader title="3. Topic & Notes" />
                                <CardBody className="pt-0 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[var(--text-primary)]">
                                            Session Topic or Doubt <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={topic}
                                            onChange={e => setTopic(e.target.value)}
                                            placeholder="Specify the exact topic, question, or doubt you want to solve..."
                                            className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm focus:outline-none focus:border-brand-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[var(--text-primary)]">Additional Notes (Optional)</label>
                                        <textarea
                                            rows={2}
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            placeholder="Any prerequisite links or notes for the mentor..."
                                            className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm focus:outline-none focus:border-brand-500 transition-all resize-none"
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                className="py-3.5 shadow-lg shadow-brand-500/25"
                            >
                                {isSubmitting ? 'Submitting Request...' : 'Submit Booking Request'}
                            </Button>

                        </form>
                    </div>

                    {/* RIGHT COLUMN - Summary */}
                    <div className="hidden lg:block relative text-white">
                        <div className="sticky top-6">
                            <Card variant="glass" className="border-brand-500/30 overflow-hidden relative shadow-2xl shadow-brand-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                <CardHeader title="Booking Summary" />
                                <CardBody className="pt-0 flex flex-col gap-5 z-10 relative text-gray-200">

                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-700/50">
                                        <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 font-extrabold flex items-center justify-center">
                                            {selectedMentor?.fullName ? selectedMentor.fullName.charAt(0).toUpperCase() : 'M'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)] text-sm">{selectedMentor?.fullName || 'Verified Mentor'}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{selectedMentor?.department || 'Department'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-[var(--text-muted)]">Skill</span>
                                            <span className="text-sm font-bold text-[var(--text-primary)] text-right">{skillName || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-[var(--text-muted)]">Date</span>
                                            <span className="text-sm font-bold text-[var(--text-primary)] text-right flex items-center gap-1">
                                                <CalendarIcon size={14} /> {scheduledDate}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-[var(--text-muted)]">Time Slot</span>
                                            <span className="text-sm font-bold text-[var(--text-primary)] text-right flex items-center gap-1">
                                                <Clock size={14} /> {scheduledTime}
                                            </span>
                                        </div>
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
