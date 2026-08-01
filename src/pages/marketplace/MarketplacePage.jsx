import { useState, useEffect, useCallback } from 'react';
import {
    Search, Plus, Edit3, Trash2, ShieldCheck, Tag,
    SlidersHorizontal, X, Layers, AlertCircle, BookOpen,
    CheckCircle2, XCircle, RefreshCw, User, Users
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { Card, CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = ['All', 'Programming', 'Design', 'AI/ML', 'Data Science', 'Communication', 'Aptitude', 'Others'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const STATUS_OPTIONS = ['Active', 'Inactive'];

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function MarketplacePage() {
    const { user, token } = useAuth();
    const { toast } = useToast();

    // Check if user has management permissions (Faculty & Admin only)
    const canManage = user?.role === 'faculty' || user?.role === 'admin';

    // State management
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDifficulty, setActiveDifficulty] = useState('All');
    const [activeStatus, setActiveStatus] = useState('All');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Mentors Modal state
    const [isMentorsModalOpen, setIsMentorsModalOpen] = useState(false);
    const [skillMentors, setSkillMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(false);


    // Form state
    const [formData, setFormData] = useState({
        skillName: '',
        category: 'Programming',
        description: '',
        difficulty: 'Beginner',
        status: 'Active',
    });

    const [formErrors, setFormErrors] = useState({});

    // Fetch skills from backend API
    const fetchSkills = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE_URL}/skills`, {
                headers
            });

            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {
                setSkills(data.data);
            } else {
                setError(data.message || 'Failed to load skills.');
                toast({
                    variant: 'error',
                    title: 'Error Loading Skills',
                    message: data.message || 'Failed to fetch skills from backend.',
                });
            }
        } catch (err) {
            console.error('Fetch skills error:', err);
            setError('Could not connect to the backend server.');
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Could not connect to SkillSync backend server.',
            });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    // Fetch approved mentors for a specific skill
    const handleViewMentors = async (skill) => {
        setSelectedSkill(skill);
        setIsMentorsModalOpen(true);
        setLoadingMentors(true);
        setSkillMentors([]);
        try {
            const res = await fetch(`${API_BASE_URL}/mentor/mentors-for-skill?skill=${encodeURIComponent(skill.skillName)}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setSkillMentors(data.data);
            } else {
                toast({
                    variant: 'error',
                    title: 'Fetch Mentors Failed',
                    message: data.message || `Failed to fetch mentors for ${skill.skillName}.`
                });
            }
        } catch (err) {
            console.error('Fetch mentors error:', err);
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to connect to backend server.'
            });
        } finally {
            setLoadingMentors(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);


    // Handle Form Inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.skillName.trim()) {
            errors.skillName = 'Skill Name is required';
        }
        if (!formData.category.trim()) {
            errors.category = 'Category is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Open Add Modal
    const handleOpenAddModal = () => {
        setFormData({
            skillName: '',
            category: 'Programming',
            description: '',
            difficulty: 'Beginner',
            status: 'Active',
        });
        setFormErrors({});
        setIsAddModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEditModal = (skill) => {
        setSelectedSkill(skill);
        setFormData({
            skillName: skill.skillName || '',
            category: skill.category || 'Programming',
            description: skill.description || '',
            difficulty: skill.difficulty || 'Beginner',
            status: skill.status || (skill.isActive ? 'Active' : 'Inactive'),
        });
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    // Open Delete Modal
    const handleOpenDeleteModal = (skill) => {
        setSelectedSkill(skill);
        setIsDeleteModalOpen(true);
    };

    // Create Skill
    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!canManage) {
            toast({ variant: 'error', title: 'Unauthorized', message: 'Only Faculty and Admin can add skills.' });
            return;
        }
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/skills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                toast({
                    variant: 'success',
                    title: 'Skill Created',
                    message: `Skill "${formData.skillName}" created successfully!`,
                });
                setIsAddModalOpen(false);
                fetchSkills();
            } else {
                toast({
                    variant: 'error',
                    title: 'Create Failed',
                    message: data.message || 'Could not create skill.',
                });
            }
        } catch (err) {
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to create skill due to server error.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Update Skill
    const handleEditSkill = async (e) => {
        e.preventDefault();
        if (!canManage || !selectedSkill) {
            toast({ variant: 'error', title: 'Unauthorized', message: 'Only Faculty and Admin can edit skills.' });
            return;
        }
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/skills/${selectedSkill._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                toast({
                    variant: 'success',
                    title: 'Skill Updated',
                    message: `Skill "${formData.skillName}" updated successfully!`,
                });
                setIsEditModalOpen(false);
                setSelectedSkill(null);
                fetchSkills();
            } else {
                toast({
                    variant: 'error',
                    title: 'Update Failed',
                    message: data.message || 'Could not update skill.',
                });
            }
        } catch (err) {
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to update skill due to server error.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Skill
    const handleDeleteSkill = async () => {
        if (!canManage || !selectedSkill) {
            toast({ variant: 'error', title: 'Unauthorized', message: 'Only Faculty and Admin can delete skills.' });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/skills/${selectedSkill._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                toast({
                    variant: 'success',
                    title: 'Skill Deleted',
                    message: `Skill "${selectedSkill.skillName}" deleted successfully!`,
                });
                setIsDeleteModalOpen(false);
                setSelectedSkill(null);
                fetchSkills();
            } else {
                toast({
                    variant: 'error',
                    title: 'Delete Failed',
                    message: data.message || 'Could not delete skill.',
                });
            }
        } catch (err) {
            toast({
                variant: 'error',
                title: 'Network Error',
                message: 'Failed to delete skill due to server error.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Filter skills logic
    const filteredSkills = skills.filter(skill => {
        if (activeCategory !== 'All' && skill.category !== activeCategory) return false;
        if (activeDifficulty !== 'All' && skill.difficulty !== activeDifficulty) return false;
        if (activeStatus !== 'All') {
            const currentStatus = skill.status || (skill.isActive ? 'Active' : 'Inactive');
            if (currentStatus !== activeStatus) return false;
        }
        if (search) {
            const q = search.toLowerCase();
            const nameMatch = skill.skillName?.toLowerCase().includes(q);
            const catMatch = skill.category?.toLowerCase().includes(q);
            const descMatch = skill.description?.toLowerCase().includes(q);
            if (!nameMatch && !catMatch && !descMatch) return false;
        }
        return true;
    });

    return (
        <AppLayout pageTitle="Skill Management" activeNavId="skills">
            <div className="animate-fade-in flex flex-col gap-6" style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
                            Skill Management
                        </h1>
                        <p className="text-[var(--text-secondary)] font-medium text-[0.9375rem] max-w-2xl">
                            {canManage
                                ? 'View, create, edit, and delete core technical and non-technical skills.'
                                : 'Explore skills available across the platform.'}
                        </p>
                    </div>

                    {/* Faculty and Admin ONLY: Add Skill Button */}
                    {canManage && (
                        <Button
                            variant="primary"
                            onClick={handleOpenAddModal}
                            leftIcon={<Plus size={18} />}
                            className="shadow-lg hover:shadow-brand-500/25 transition-all self-start sm:self-auto"
                        >
                            Add New Skill
                        </Button>
                    )}
                </div>

                {/* Top Search & Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 flex-1 max-w-lg items-center gap-2 focus-within:border-brand-500 transition-colors">
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search skills by name, category, or description..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none flex-1 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
                        <Button
                            variant="outline"
                            className="lg:hidden"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            leftIcon={<SlidersHorizontal size={16} />}
                        >
                            Filters
                        </Button>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={fetchSkills} leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}>
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Filters Dropdown */}
                {showMobileFilters && (
                    <div className="lg:hidden p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] mb-2 flex flex-col gap-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-[var(--text-primary)]">Filter Skills</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="text-[var(--text-muted)]"><X size={18} /></button>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1 block">Category</label>
                            <select value={activeCategory} onChange={e => setActiveCategory(e.target.value)} className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-3 py-2">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1 block">Difficulty</label>
                            <select value={activeDifficulty} onChange={e => setActiveDifficulty(e.target.value)} className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-3 py-2">
                                <option value="All">All Difficulties</option>
                                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {canManage && (
                            <div>
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1 block">Status</label>
                                <select value={activeStatus} onChange={e => setActiveStatus(e.target.value)} className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg px-3 py-2">
                                    <option value="All">All Statuses</option>
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-8 relative items-start">

                    {/* LEFT SIDEBAR (Desktop Filters) */}
                    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-4 gap-6">

                        {/* Category Filter */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                                <Tag size={14} /> Category
                            </h4>
                            <div className="flex flex-col gap-1">
                                {CATEGORIES.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setActiveCategory(c)}
                                        className={`text-left text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${activeCategory === c ? 'bg-brand-500/10 text-brand-500 font-semibold border border-brand-500/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'}`}
                                    >
                                        <span>{c}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                                <Layers size={14} /> Difficulty
                            </h4>
                            <div className="flex flex-col gap-1">
                                {['All', ...DIFFICULTIES].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setActiveDifficulty(d)}
                                        className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${activeDifficulty === d ? 'bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter (Faculty / Admin view) */}
                        {canManage && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                                    <CheckCircle2 size={14} /> Status
                                </h4>
                                <div className="flex flex-col gap-1">
                                    {['All', ...STATUS_OPTIONS].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setActiveStatus(s)}
                                            className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${activeStatus === s ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    </aside>

                    {/* MAIN GRID */}
                    <div className="flex-1 w-full min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 lg:gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <Card key={i} variant="glass" className="h-48 animate-pulse p-6">
                                        <div className="h-6 bg-white/10 rounded w-2/3 mb-4"></div>
                                        <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-white/5 rounded w-4/5 mb-6"></div>
                                        <div className="h-6 bg-white/10 rounded w-1/3 mt-auto"></div>
                                    </Card>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/5 text-center">
                                <AlertCircle size={36} className="text-red-400 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-red-400 mb-1">{error}</h3>
                                <p className="text-sm text-[var(--text-secondary)] mb-4">Make sure MongoDB and backend server are running on port 5000.</p>
                                <Button variant="primary" onClick={fetchSkills}>Try Again</Button>
                            </div>
                        ) : filteredSkills.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 lg:gap-6">
                                {filteredSkills.map(skill => {
                                    const skillStatus = skill.status || (skill.isActive ? 'Active' : 'Inactive');
                                    const isInactive = skillStatus === 'Inactive';

                                    return (
                                        <Card
                                            key={skill._id}
                                            variant="glass"
                                            className={`flex flex-col transition-all duration-300 transform-gpu hover:-translate-y-1 relative overflow-hidden ${isInactive ? 'opacity-70 border-dashed' : 'hover:border-brand-500/40'}`}
                                        >
                                            <CardBody className="p-5 flex-1 flex flex-col justify-between z-10 gap-4">

                                                {/* Header Row */}
                                                <div>
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h3 className="font-bold text-lg text-[var(--text-primary)] tracking-tight">
                                                            {skill.skillName}
                                                        </h3>

                                                        {/* Status Badge */}
                                                        <Badge
                                                            variant={skillStatus === 'Active' ? 'success' : 'danger'}
                                                            size="sm"
                                                        >
                                                            {skillStatus}
                                                        </Badge>
                                                    </div>

                                                    {/* Category & Difficulty */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                                                            {skill.category}
                                                        </span>
                                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${skill.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/20' : skill.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                            {skill.difficulty}
                                                        </span>
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 min-h-[42px]">
                                                        {skill.description || 'No description provided.'}
                                                    </p>
                                                </div>

                                                    {/* Card Footer */}
                                                 <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between mt-auto">
                                                     <Button
                                                         variant="primary"
                                                         size="sm"
                                                         onClick={() => handleViewMentors(skill)}
                                                         leftIcon={<Users size={14} />}
                                                     >
                                                         View Mentors
                                                     </Button>

                                                     {/* ACTION BUTTONS (Faculty & Admin ONLY) */}
                                                     {canManage ? (
                                                         <div className="flex items-center gap-1.5">
                                                             <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() => handleOpenEditModal(skill)}
                                                                 leftIcon={<Edit3 size={14} />}
                                                                 title="Edit Skill"
                                                                 style={{ padding: '0.35rem 0.6rem' }}
                                                             >
                                                                 Edit
                                                             </Button>
                                                             <Button
                                                                 variant="danger"
                                                                 size="sm"
                                                                 onClick={() => handleOpenDeleteModal(skill)}
                                                                 leftIcon={<Trash2 size={14} />}
                                                                 title="Delete Skill"
                                                                 style={{ padding: '0.35rem 0.6rem' }}
                                                             >
                                                                 Delete
                                                             </Button>
                                                         </div>
                                                     ) : (
                                                         <div className="text-xs text-[var(--text-muted)] truncate">
                                                             Added by: <span className="font-medium text-[var(--text-secondary)]">{skill.createdBy?.fullName || 'Faculty/Admin'}</span>
                                                         </div>
                                                     )}
                                                 </div>

                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty state */
                            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[rgba(255,255,255,0.01)] animate-fade-in mt-4">
                                <div className="w-16 h-16 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center mb-4 text-[#818cf8]">
                                    <BookOpen size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No skills found</h3>
                                <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
                                    We couldn't find any skills matching your search query or filters.
                                </p>
                                <Button variant="primary" onClick={() => { setSearch(''); setActiveCategory('All'); setActiveDifficulty('All'); setActiveStatus('All'); }}>
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ADD SKILL MODAL (Faculty / Admin ONLY) */}
                {canManage && (
                    <Modal
                        open={isAddModalOpen}
                        onClose={() => !submitting && setIsAddModalOpen(false)}
                        title="Add New Skill"
                        description="Enter details to add a new skill to the platform."
                        size="md"
                    >
                        <form onSubmit={handleAddSkill} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                    Skill Name <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="text"
                                    name="skillName"
                                    placeholder="e.g. React.js, Python, Figma"
                                    value={formData.skillName}
                                    onChange={handleInputChange}
                                    error={formErrors.skillName}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                        Category <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500"
                                    >
                                        {CATEGORIES.filter(c => c !== 'All').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                        Difficulty <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500"
                                    >
                                        {DIFFICULTIES.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500"
                                >
                                    {STATUS_OPTIONS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Brief description of what this skill entails..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl p-3 outline-none focus:border-brand-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)] mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Creating...' : 'Create Skill'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* EDIT SKILL MODAL (Faculty / Admin ONLY) */}
                {canManage && (
                    <Modal
                        open={isEditModalOpen}
                        onClose={() => !submitting && setIsEditModalOpen(false)}
                        title="Edit Skill"
                        description={`Modify skill details for "${selectedSkill?.skillName}".`}
                        size="md"
                    >
                        <form onSubmit={handleEditSkill} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                    Skill Name <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="text"
                                    name="skillName"
                                    placeholder="Skill Name"
                                    value={formData.skillName}
                                    onChange={handleInputChange}
                                    error={formErrors.skillName}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                        Category <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500"
                                    >
                                        {CATEGORIES.filter(c => c !== 'All').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                        Difficulty <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500"
                                    >
                                        {DIFFICULTIES.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500"
                                >
                                    {STATUS_OPTIONS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1 block">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Brief description of what this skill entails..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl p-3 outline-none focus:border-brand-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)] mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* DELETE CONFIRMATION MODAL (Faculty / Admin ONLY) */}
                {canManage && (
                    <Modal
                        open={isDeleteModalOpen}
                        onClose={() => !submitting && setIsDeleteModalOpen(false)}
                        title="Delete Skill"
                        description={`Are you sure you want to delete "${selectedSkill?.skillName}"? This action cannot be undone.`}
                        size="sm"
                    >
                        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)] mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="danger"
                                onClick={handleDeleteSkill}
                                disabled={submitting}
                            >
                                {submitting ? 'Deleting...' : 'Delete Skill'}
                            </Button>
                        </div>
                    </Modal>
                )}

                {/* APPROVED MENTORS FOR SKILL MODAL */}
                <Modal
                    open={isMentorsModalOpen}
                    onClose={() => setIsMentorsModalOpen(false)}
                    title={`Verified Mentors for ${selectedSkill?.skillName}`}
                    description={`Showing only approved, certified mentors verified by Faculty for ${selectedSkill?.skillName}.`}
                    size="md"
                >
                    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 mt-2">
                        {loadingMentors ? (
                            <div className="text-center py-6 text-sm text-[var(--text-muted)] animate-pulse">
                                <RefreshCw className="animate-spin inline mr-2" size={16} /> Retrieving verified mentors...
                            </div>
                        ) : skillMentors.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {skillMentors.map(m => (
                                    <div key={m._id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] flex justify-between items-center hover:border-brand-500/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm uppercase">
                                                {m.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2) || 'M'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                                                    {m.fullName}
                                                    <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">✓ Verified</span>
                                                </h4>
                                                <p className="text-xs text-[var(--text-muted)]">{m.department} · Year {m.year}</p>
                                                <p className="text-[0.7rem] text-brand-400 font-bold mt-1">Assessment Score: {m.assessmentScore || 14}/{m.totalQuestions || 20}</p>
                                            </div>
                                        </div>
                                        {user && user._id !== m._id && user.role !== 'faculty' && user.role !== 'admin' && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => {
                                                    setIsMentorsModalOpen(false);
                                                    // Pass state to route
                                                    navigate('book-session');
                                                }}
                                            >
                                                Book Session
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed border-[var(--border-color)] rounded-xl bg-white/[0.01]">
                                <User className="text-[var(--text-muted)] mx-auto mb-2 opacity-50" size={32} />
                                <p className="text-sm font-bold text-[var(--text-secondary)]">No verified mentors yet</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
                                    Become the first verified mentor for {selectedSkill?.skillName} by applying through Apply as Mentor!
                                </p>
                            </div>
                        )}
                    </div>
                </Modal>

            </div>
        </AppLayout>
    );
}

