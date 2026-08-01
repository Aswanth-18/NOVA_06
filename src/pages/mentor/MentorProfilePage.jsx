import React from 'react';
import {
    CheckCircle2, Star, Clock, MapPin,
    MessageSquare, Calendar, Globe, Award, Briefcase, ChevronRight, Share2, Heart
} from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import { useRouter } from '../../context/RouterContext';

/* -- Dummy Data -- */
const MENTOR_DATA = {
    name: "Sarah Lin",
    department: "AI & DS",
    year: "Senior Year",
    verified: true,
    badge: "Gold", // Bronze, Silver, Gold
    rating: 5.0,
    totalSessions: 142,
    joinedDate: "August 2024",
    availability: "Available",
    bio: "Passionate UX/UI designer focusing on building scalable design systems and accessible digital experiences. I love helping students bridge the gap between aesthetics and functionality.",
    expertise: ["UI/UX", "Product Strategy", "Design Systems"],
    languages: ["English", "Mandarin"],
    teachingStyle: "Hands-on, project-based learning with a strong emphasis on user-centered design principles.",
    skills: ["Figma", "React", "HTML/CSS", "Wireframing", "Prototyping", "User Research"],
    experience: {
        years: 3,
        projects: 24,
        certifications: ["Google UX Design Professional", "IDF UI Design"],
        achievements: ["Best Capstone Project 2025", "Top Mentor Q3"]
    },
    reviews: [
        { name: "John Doe", rating: 5, date: "Oct 12, 2025", text: "Sarah was incredibly helpful in guiding my portfolio redesign. Highly recommended!" },
        { name: "Emma Smith", rating: 5, date: "Sep 28, 2025", text: "Clear explanations and practical advice. I finally understand auto-layout in Figma." },
        { name: "Raj Patel", rating: 4.8, date: "Sep 15, 2025", text: "Great session on design systems. Gave me lots of resources to study further." },
        { name: "Lisa Wong", rating: 5, date: "Aug 30, 2025", text: "Very patient and knowledgeable. Fixed my project issues in 15 minutes." }
    ],
    schedule: [
        { day: "Mon", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
        { day: "Tue", slots: [] },
        { day: "Wed", slots: ["11:00 AM", "3:00 PM"] },
        { day: "Thu", slots: ["1:00 PM", "5:00 PM"] },
        { day: "Fri", slots: ["10:00 AM"] },
        { day: "Sat", slots: ["9:00 AM", "11:00 AM"] },
        { day: "Sun", slots: [] }
    ],
    summary: {
        responseTime: "< 2 hours",
        completionRate: "98%"
    }
};

const SIMILAR_MENTORS = [
    { name: 'David Chen', dept: 'IT', rating: 4.8, skills: ['Cloud', 'DevOps'], letter: 'D', color: '#f59e0b' },
    { name: 'Arjun Mehta', dept: 'CSE', rating: 4.9, skills: ['Python', 'Django'], letter: 'A', color: '#3B82F6' },
    { name: 'Elena Rostova', dept: 'AI & DS', rating: 4.7, skills: ['Framer', 'UI/UX'], letter: 'E', color: '#ec4899' },
    { name: 'Michael Chang', dept: 'CSE', rating: 5.0, skills: ['React', 'Node.js'], letter: 'M', color: '#10b981' },
];

export default function MentorProfilePage() {
    const { navigate } = useRouter();

    return (
        <AppLayout pageTitle="Mentor Profile" activeNavId="mentor">
            <div className="animate-fade-in flex flex-col gap-6 lg:gap-8 pb-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Profile Header */}
                <Card variant="glass" className="overflow-hidden border border-[var(--border-color)] relative">
                    <div className="h-32 md:h-48 w-full bg-gradient-to-r from-brand-600 via-purple-600 to-brand-400 opacity-80" />
                    <CardBody className="pt-0 relative px-6 md:px-10 pb-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-500 p-1 shadow-xl">
                                    <div className="w-full h-full rounded-[14px] bg-[var(--bg-elevated)] flex items-center justify-center text-5xl font-bold text-white overflow-hidden">
                                        <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%236366f1%22%20rx%3D%2220%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22central%22%3EST%3C%2Ftext%3E%3C%2Fsvg%3E" alt={MENTOR_DATA.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                {MENTOR_DATA.verified && (
                                    <div className="absolute -bottom-2 -right-2 bg-[var(--bg-base)] rounded-full p-1 shadow-lg">
                                        <CheckCircle2 className="text-blue-500 w-8 h-8 fill-blue-500/20" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] my-0">{MENTOR_DATA.name}</h1>
                                        {MENTOR_DATA.badge === 'Gold' && (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Award size={14} /> Gold Mentor
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase ${MENTOR_DATA.availability === 'Available' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                            {MENTOR_DATA.availability}
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-lg font-medium mt-1">
                                        {MENTOR_DATA.department} • {MENTOR_DATA.year}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[var(--text-muted)]">
                                    <div className="flex items-center gap-1.5"><Star size={16} className="text-amber-400 fill-amber-400" /> <span className="text-[var(--text-primary)]">{MENTOR_DATA.rating}</span> ({MENTOR_DATA.totalSessions} sessions)</div>
                                    <div className="flex items-center gap-1.5"><Clock size={16} /> Joined {MENTOR_DATA.joinedDate}</div>
                                </div>
                            </div>

                            {/* Actions - Mobile Only Actions */}
                            <div className="md:hidden w-full flex gap-3 mt-4">
                                <button
                                    onClick={() => navigate('book-session')}
                                    className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all">
                                    <Calendar size={18} /> Book
                                </button>
                                <button className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-bold flex justify-center items-center transition-all">
                                    <MessageSquare size={18} />
                                </button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* LEFT COLUMN - Main Info */}
                    <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">

                        {/* About Section */}
                        <Card variant="glass">
                            <CardHeader title="About Me" />
                            <CardBody className="pt-0 flex flex-col gap-5 text-[var(--text-secondary)]">
                                <p className="leading-relaxed text-[0.95rem]">{MENTOR_DATA.bio}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Teaching Style</h4>
                                        <p className="text-sm">{MENTOR_DATA.teachingStyle}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Languages</h4>
                                        <div className="flex gap-2">
                                            {MENTOR_DATA.languages.map(lang => (
                                                <span key={lang} className="px-2.5 py-1 bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded-lg text-xs font-semibold">{lang}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Skills Section */}
                        <Card variant="glass">
                            <CardHeader title="Skills & Expertise" />
                            <CardBody className="pt-0">
                                <div className="flex flex-wrap gap-2.5">
                                    {MENTOR_DATA.skills.map(_skill => (
                                        <span key={_skill} className="px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 font-semibold text-sm hover:bg-brand-500/20 transition-colors">
                                            {_skill}
                                        </span>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Experience Section */}
                        <Card variant="glass">
                            <CardHeader title="Experience & Achievements" />
                            <CardBody className="pt-0 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-4 border-l-2 border-[var(--border-color)] pl-5 py-2">
                                    <div className="relative">
                                        <div className="absolute -left-[30px] top-0 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                        <h4 className="font-bold text-[var(--text-primary)]">{MENTOR_DATA.experience.years}+ Years Experience</h4>
                                        <p className="text-sm text-[var(--text-muted)] mt-1">Professional industry practice.</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[30px] top-0 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                        <h4 className="font-bold text-[var(--text-primary)]">{MENTOR_DATA.experience.projects} Projects Completed</h4>
                                        <p className="text-sm text-[var(--text-muted)] mt-1">Successfully guided student projects.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 justify-center">
                                    {MENTOR_DATA.experience.certifications.map((cert) => (
                                        <div key={cert} className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)]">
                                            <Award className="text-amber-500" size={20} />
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Availability Section */}
                        <Card variant="glass">
                            <CardHeader title="Weekly Availability" action={<span className="text-xs text-[var(--text-muted)] font-medium">Timezone: UTC+5:30</span>} />
                            <CardBody className="pt-0 flex flex-col gap-3">
                                {MENTOR_DATA.schedule.map((dayData, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl border border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
                                        <div className="w-16 font-bold text-[var(--text-secondary)]">{dayData.day}</div>
                                        <div className="flex-1 flex flex-wrap gap-2">
                                            {dayData.slots.length > 0 ? dayData.slots.map(slot => (
                                                <button key={slot} className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold hover:bg-brand-500 hover:text-white transition-colors">
                                                    {slot}
                                                </button>
                                            )) : (
                                                <span className="text-xs text-[var(--text-muted)] font-medium italic">Not available</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>

                        {/* Student Reviews */}
                        <Card variant="glass">
                            <CardHeader title="Student Reviews" action={<span className="text-brand-400 text-sm font-bold">{MENTOR_DATA.reviews.length} total</span>} />
                            <CardBody className="pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MENTOR_DATA.reviews.map((review, i) => (
                                    <div key={i} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-[var(--text-primary)] text-sm">{review.name}</h5>
                                                    <p className="text-xs text-[var(--text-muted)]">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-[#f59e0b1a] px-2 py-1 rounded-md">
                                                <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                                <span className="text-xs font-bold text-[#fbbf24]">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">"{review.text}"</p>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN - Sticky Sidebar */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-6 flex flex-col gap-6">

                            {/* Summary & Booking Card */}
                            <Card variant="elevated" className="border-brand-500/20 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-500" />
                                <CardBody className="flex flex-col gap-5 p-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)]">
                                        <div className="text-center">
                                            <div className="text-2xl font-extrabold text-[var(--text-primary)] flex items-center justify-center gap-1">
                                                {MENTOR_DATA.rating} <Star size={18} fill="#f59e0b" color="#f59e0b" />
                                            </div>
                                            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase mt-1">Rating</div>
                                        </div>
                                        <div className="w-px h-10 bg-[var(--border-color)]" />
                                        <div className="text-center">
                                            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{MENTOR_DATA.totalSessions}</div>
                                            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase mt-1">Sessions</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 pb-4 border-b border-[var(--border-color)]">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[var(--text-secondary)] font-medium flex items-center gap-2"><Clock size={16} /> Response Time</span>
                                            <span className="text-[var(--text-primary)] font-bold">{MENTOR_DATA.summary.responseTime}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[var(--text-secondary)] font-medium flex items-center gap-2"><CheckCircle2 size={16} /> Completion Rate</span>
                                            <span className="text-[var(--text-primary)] font-bold">{MENTOR_DATA.summary.completionRate}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => navigate('book-session')} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-[0.95rem] flex justify-center items-center gap-2 shadow-lg shadow-brand-500/25 transition-all">
                                            <Calendar size={18} /> Book Session
                                        </button>
                                        <button className="w-full py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all">
                                            <MessageSquare size={18} /> Send Message
                                        </button>
                                    </div>

                                    <div className="flex justify-center gap-4 mt-2">
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                            <Heart size={14} /> Save Mentor
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                            <Share2 size={14} /> Share Profile
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                </div>

                {/* Bottom Section: Similar Mentors */}
                <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-[var(--border-color)]">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Similar Mentors</h2>
                    <div className="flex overflow-x-auto gap-5 pb-4 hide-scrollbar snap-x">
                        {SIMILAR_MENTORS.map((mentor) => (
                            <Card key={mentor.name} variant="elevated" className="min-w-[280px] snap-start hover:border-brand-500/50 transition-colors duration-300">
                                <CardBody className="p-5 flex flex-col gap-4 relative">
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, ${mentor.color}, #6366f1)` }}>
                                                {mentor.letter}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--text-primary)] text-[1.0625rem]">{mentor.name}</h4>
                                                <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{mentor.dept}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-1 bg-[#f59e0b1a] px-2 py-1 rounded-lg">
                                            <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                            <span className="text-xs font-bold text-[#fbbf24]">{mentor.rating}</span>
                                        </div>
                                        <button className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] hover:bg-[var(--bg-base)] text-xs font-bold text-[var(--text-primary)] transition-all">
                                            View
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </AppLayout>
    );
}
