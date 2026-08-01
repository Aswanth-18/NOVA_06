import { useState, useEffect, useRef, useCallback } from 'react';
import {
    CheckCircle2, Clock, AlertCircle, ArrowRight, ArrowLeft,
    Check, X, FileQuestion, BookOpen, GraduationCap, ShieldCheck,
    Award, RefreshCw
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

/* ─── 20 MCQ Questions Across Required Topics ─── */
const QUESTIONS = [
    {
        id: 1,
        topic: 'Java',
        text: 'Which keyword is used to prevent method overriding in Java?',
        options: ['static', 'final', 'abstract', 'private'],
        correct: 1
    },
    {
        id: 2,
        topic: 'Java',
        text: 'What is the default value of an uninitialized boolean instance variable in Java?',
        options: ['true', 'false', 'null', '0'],
        correct: 1
    },
    {
        id: 3,
        topic: 'Java',
        text: 'Which JVM memory region is responsible for storing runtime objects created via new?',
        options: ['Stack Memory', 'Heap Memory', 'Method Area', 'PC Register'],
        correct: 1
    },
    {
        id: 4,
        topic: 'Python',
        text: 'What is the output of type([]) in Python?',
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'dict'>"],
        correct: 1
    },
    {
        id: 5,
        topic: 'Python',
        text: 'Which keyword is used to define an anonymous inline function in Python?',
        options: ['def', 'func', 'lambda', 'inline'],
        correct: 2
    },
    {
        id: 6,
        topic: 'Python',
        text: 'Which Python data structure stores unordered collections of unique elements?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correct: 2
    },
    {
        id: 7,
        topic: 'DBMS',
        text: 'Which normal form ensures that non-key attributes are fully functionally dependent on the primary key (no partial dependency)?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correct: 1
    },
    {
        id: 8,
        topic: 'DBMS',
        text: 'What does ACID stand for in database transaction management?',
        options: [
            'Atomicity, Consistency, Isolation, Durability',
            'Authentication, Concurrency, Integrity, Data',
            'Automated, Control, Index, Database',
            'Access, Cipher, Isolation, Deletion'
        ],
        correct: 0
    },
    {
        id: 9,
        topic: 'DBMS',
        text: 'Which SQL constraint uniquely identifies each record in a table and cannot contain NULL values?',
        options: ['FOREIGN KEY', 'UNIQUE', 'PRIMARY KEY', 'CHECK'],
        correct: 2
    },
    {
        id: 10,
        topic: 'OOP',
        text: 'Which Object-Oriented Programming pillar allows a subclass to provide a specific implementation of a method defined in its superclass?',
        options: ['Encapsulation', 'Abstraction', 'Polymorphism', 'Inheritance'],
        correct: 2
    },
    {
        id: 11,
        topic: 'OOP',
        text: 'What is encapsulation in Object-Oriented Programming?',
        options: [
            'Deriving new classes from existing parent classes',
            'Bundling data and methods together inside a single unit/class and restricting direct access',
            'Executing multiple functions with the same name but different arguments',
            'Hiding execution details behind interface abstractions'
        ],
        correct: 1
    },
    {
        id: 12,
        topic: 'OOP',
        text: 'Can an abstract class in Java have concrete methods with bodies?',
        options: [
            'No, abstract classes can only contain abstract methods',
            'Yes, abstract classes can contain both abstract and concrete methods',
            'Only if declared static',
            'Only if declared private'
        ],
        correct: 1
    },
    {
        id: 13,
        topic: 'Aptitude',
        text: 'A train 150 meters long passes a stationary telegraph pole in 15 seconds. What is the speed of the train in km/hr?',
        options: ['30 km/hr', '36 km/hr', '45 km/hr', '54 km/hr'],
        correct: 1
    },
    {
        id: 14,
        topic: 'Aptitude',
        text: 'If 6 men or 8 women can complete a task in 12 days, how many days will 3 men and 4 women take to finish it?',
        options: ['8 days', '10 days', '12 days', '14 days'],
        correct: 2
    },
    {
        id: 15,
        topic: 'Aptitude',
        text: 'The average of 5 consecutive integers is 20. What is the largest integer among them?',
        options: ['21', '22', '23', '24'],
        correct: 1
    },
    {
        id: 16,
        topic: 'Communication Skills',
        text: 'When a student struggles with a concept during a mentoring session, what is the most effective approach?',
        options: [
            'Repeat the exact same explanation louder',
            'Ask open-ended questions to identify their conceptual gap and explain using a practical analogy',
            'Skip the topic and move to the next section',
            'Tell them to search YouTube tutorials after the session'
        ],
        correct: 1
    },
    {
        id: 17,
        topic: 'Communication Skills',
        text: 'Which tone of voice is most appropriate for a mentor when performing a code review?',
        options: ['Critical and strict', 'Constructive, supportive, and objective', 'Indifferent and quick', 'Overly casual'],
        correct: 1
    },
    {
        id: 18,
        topic: 'Communication Skills',
        text: 'What does active listening involve during a mentorship session?',
        options: [
            'Preparing your next response while the student is speaking',
            'Focusing fully on the student, confirming understanding, and summarizing key points before answering',
            'Interrupting whenever the student makes a technical error',
            'Taking notes without making eye contact'
        ],
        correct: 1
    },
    {
        id: 19,
        topic: 'Java',
        text: 'Which interface must a class implement to enable object serialization in Java?',
        options: ['Cloneable', 'Serializable', 'Comparable', 'Runnable'],
        correct: 1
    },
    {
        id: 20,
        topic: 'Python',
        text: 'How do you define a tuple containing a single element in Python?',
        options: ['(5)', '[5]', '(5,)', 'tuple(5)'],
        correct: 2
    }
];

export default function MentorAssessmentPage() {
    const { navigate } = useRouter();
    const { token } = useAuth();
    const { toast } = useToast();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { [questionIdx]: optionIdx }
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes countdown (1200s)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal state for result
    const [showResultModal, setShowResultModal] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState(null); // { score, total, percentage, passed, message }

    const timerRef = useRef(null);

    // Score Calculation & Submission Handler
    const submitAssessment = useCallback(async (autoSubmitted = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (timerRef.current) clearInterval(timerRef.current);

        // Read the skills the user selected in BecomeMentorPage (persisted in localStorage)
        let selectedSkills = [];
        try {
            const stored = localStorage.getItem('mentorApplication_selectedSkills')
                || sessionStorage.getItem('mentorApplication_selectedSkills');
            selectedSkills = stored ? JSON.parse(stored) : [];
        } catch { selectedSkills = []; }

        // Calculate score
        let score = 0;
        QUESTIONS.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct) {
                score += 1;
            }
        });

        const total = QUESTIONS.length;
        const percentage = Number(((score / total) * 100).toFixed(1));
        const passed = percentage >= 70;

        try {
            const res = await fetch(`${API_BASE_URL}/mentor/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    score,
                    totalQuestions: total,
                    // Send the skills selected by the user in BecomeMentorPage
                    skills: selectedSkills.length > 0 ? selectedSkills : ['Java', 'Python', 'React', 'DBMS'],
                    skillsTeaching: selectedSkills.length > 0 ? selectedSkills : ['Java', 'Python', 'React', 'DBMS'],
                })
            });

            const data = await res.json();

            setAssessmentResult({
                score,
                total,
                percentage,
                passed,
                message: data.message || (passed
                    ? 'Assessment Passed! Application submitted for Faculty approval.'
                    : 'Assessment Failed. Minimum score required is 70%. You can retake after 24 hours.')
            });

            setShowResultModal(true);

            // Clean up localStorage after successful submission
            try {
                localStorage.removeItem('mentorApplication_selectedSkills');
                sessionStorage.removeItem('mentorApplication_selectedSkills');
            } catch { /* ignore */ }

            if (passed) {
                toast({
                    variant: 'success',
                    title: 'Assessment Passed 🎉',
                    message: `Score: ${percentage}% (${score}/${total}). Application submitted for Faculty Approval.`,
                });
            } else {
                toast({
                    variant: 'error',
                    title: 'Assessment Failed ❌',
                    message: `Score: ${percentage}% (${score}/${total}). Required: 70%. You can retake after 24 hours.`,
                });
            }
        } catch (err) {
            console.error('Submit assessment error:', err);
            setAssessmentResult({
                score,
                total,
                percentage,
                passed,
                message: passed
                    ? 'Assessment Passed! Network issue submitting application. Please contact Faculty.'
                    : 'Assessment Failed. Score below 70%. Retake available in 24 hours.'
            });
            setShowResultModal(true);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to submit score to backend server.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, userAnswers, token, toast]);

    // Timer Effect
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    submitAssessment(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [submitAssessment]);

    // Format timer MM:SS
    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleSelectOption = (optionIdx) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: optionIdx
        }));
    };

    const currentQ = QUESTIONS[currentIndex];
    const answeredCount = Object.keys(userAnswers).length;
    const progressPct = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

    return (
        <AppLayout pageTitle="Mentor Assessment" activeNavId="mentor">
            <div className="animate-fade-in flex flex-col gap-6 pb-12" style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Page Header & Timer Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-1">
                            Mentor Qualification Assessment
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm">
                            20 Multiple Choice Questions · Passing Score: 70% (14/20)
                        </p>
                    </div>

                    {/* Timer Widget */}
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-lg transition-colors ${timeLeft < 180 ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse' : 'bg-brand-500/10 border-brand-500/30 text-brand-400'}`}>
                        <Clock size={20} />
                        <div>
                            <div className="text-[0.65rem] font-bold uppercase tracking-wider opacity-80">Time Remaining</div>
                            <div className="text-lg font-mono font-extrabold">{formatTimer(timeLeft)}</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar & Question Counter */}
                <Card variant="glass" className="p-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            <span>Question {currentIndex + 1} of {QUESTIONS.length}</span>
                            <span>{answeredCount} / {QUESTIONS.length} Answered</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[var(--border-color)] overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* MAIN QUESTION DISPLAY */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <Card variant="glass" className="border-brand-500/20 shadow-xl">
                            <CardHeader
                                title={
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-wider">
                                            Topic: {currentQ.topic}
                                        </span>
                                        <span className="text-xs font-semibold text-[var(--text-muted)]">1 Mark</span>
                                    </div>
                                }
                            />

                            <CardBody className="pt-2 flex flex-col gap-6">

                                {/* Question Text */}
                                <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] leading-relaxed">
                                    {currentQ.id}. {currentQ.text}
                                </h2>

                                {/* Options List */}
                                <div className="flex flex-col gap-3">
                                    {currentQ.options.map((optionText, optIdx) => {
                                        const isSelected = userAnswers[currentIndex] === optIdx;
                                        return (
                                            <button
                                                key={optIdx}
                                                type="button"
                                                onClick={() => handleSelectOption(optIdx)}
                                                className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between gap-3 ${isSelected ? 'bg-brand-600/20 border-brand-500 text-white shadow-md' : 'bg-[rgba(255,255,255,0.02)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:border-gray-500'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border ${isSelected ? 'bg-brand-500 border-brand-400 text-white' : 'bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-muted)]'}`}>
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </div>
                                                    <span>{optionText}</span>
                                                </div>
                                                {isSelected && <CheckCircle2 size={20} className="text-brand-400 flex-shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Navigation Controls */}
                                <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)] mt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentIndex === 0}
                                        leftIcon={<ArrowLeft size={16} />}
                                    >
                                        Previous
                                    </Button>

                                    {currentIndex < QUESTIONS.length - 1 ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => setCurrentIndex(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
                                            rightIcon={<ArrowRight size={16} />}
                                        >
                                            Next Question
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="success"
                                            onClick={() => submitAssessment(false)}
                                            disabled={isSubmitting}
                                            leftIcon={<CheckCircle2 size={16} />}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                                        </Button>
                                    )}
                                </div>

                            </CardBody>
                        </Card>
                    </div>

                    {/* QUESTION PALETTE (Right Sidebar) */}
                    <div className="lg:col-span-1">
                        <Card variant="glass" className="sticky top-6">
                            <CardHeader title="Question Palette" />
                            <CardBody className="pt-0 flex flex-col gap-4">

                                <div className="grid grid-cols-5 gap-2">
                                    {QUESTIONS.map((q, idx) => {
                                        const isAnswered = userAnswers[idx] !== undefined;
                                        const isCurrent = idx === currentIndex;

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${isCurrent ? 'ring-2 ring-brand-400 bg-brand-600 text-white' : isAnswered ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[rgba(255,255,255,0.08)]'}`}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
                                        <span>Answered ({answeredCount})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)]" />
                                        <span>Unanswered ({QUESTIONS.length - answeredCount})</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full mt-2"
                                    onClick={() => submitAssessment(false)}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Finish Assessment'}
                                </Button>

                            </CardBody>
                        </Card>
                    </div>

                </div>

                {/* RESULT MODAL */}
                <Modal
                    open={showResultModal}
                    onClose={() => {
                        setShowResultModal(false);
                        navigate('dashboard');
                    }}
                    title={assessmentResult?.passed ? 'Assessment Passed 🎉' : 'Assessment Failed ❌'}
                    size="md"
                    closeOnOverlay={false}
                >
                    {assessmentResult && (
                        <div className="flex flex-col gap-6 py-2 text-center">

                            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center border-4 ${assessmentResult.passed ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
                                {assessmentResult.passed ? <CheckCircle2 size={44} /> : <X size={44} />}
                            </div>

                            <div>
                                <h3 className={`text-2xl font-extrabold mb-1 ${assessmentResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {assessmentResult.passed ? 'Congratulations! You Passed!' : 'Assessment Failed'}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {assessmentResult.passed
                                        ? 'Your application has been created and submitted to Faculty for review.'
                                        : 'You did not achieve the required 70% passing threshold.'}
                                </p>
                            </div>

                            {/* Score Display Card */}
                            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] flex justify-around items-center">
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] font-semibold uppercase">Score</div>
                                    <div className="text-2xl font-extrabold text-[var(--text-primary)]">
                                        {assessmentResult.score} / {assessmentResult.total}
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-[var(--border-color)]" />
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] font-semibold uppercase">Percentage</div>
                                    <div className={`text-2xl font-extrabold ${assessmentResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {assessmentResult.percentage}%
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-[var(--border-color)]" />
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] font-semibold uppercase">Status</div>
                                    <div className="text-sm font-bold text-[var(--text-primary)]">
                                        {assessmentResult.passed ? 'Pending Approval' : 'Retake in 24h'}
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className={`p-4 rounded-xl border text-left text-xs leading-relaxed ${assessmentResult.passed ? 'bg-brand-500/10 border-brand-500/30 text-brand-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                                {assessmentResult.passed ? (
                                    <div className="flex items-start gap-2">
                                        <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold mb-1">Next Step: Faculty Verification</p>
                                            <p>Your role remains Student until a Faculty member reviews and approves your application. You will be notified once approved.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold mb-1">Retake Policy (24-Hour Cooldown)</p>
                                            <p>You can retake this assessment after 24 hours. Use this time to revise core concepts in Java, Python, DBMS, OOP, Aptitude, and Communication.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="primary"
                                className="w-full mt-2"
                                onClick={() => {
                                    setShowResultModal(false);
                                    navigate('dashboard');
                                }}
                            >
                                Return to Dashboard
                            </Button>

                        </div>
                    )}
                </Modal>

            </div>
        </AppLayout>
    );
}
