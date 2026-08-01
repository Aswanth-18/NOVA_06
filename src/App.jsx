import { RouterProvider, useRouter } from './context/RouterContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import MentorProfilePage from './pages/mentor/MentorProfilePage';
import BecomeMentorPage from './pages/mentor/BecomeMentorPage';
import MentorAssessmentPage from './pages/mentor/MentorAssessmentPage';
import MyStudentsPage from './pages/mentor/MyStudentsPage';
import BookSessionPage from './pages/booking/BookSessionPage';
import MyBookingsPage from './pages/booking/MyBookingsPage';
import FacultyDashboardPage from './pages/faculty/FacultyDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import MessagesPage from './pages/messages/MessagesPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import AccessDenied from './pages/AccessDenied';
import { useAuth } from './context/AuthContext';

function RouterRoot() {
  const { page } = useRouter();
  const { user } = useAuth();

  const role = user?.role; // student | mentor | faculty | admin

  // Public Routes
  if (page === 'login') return <LoginPage />;
  if (page === 'register') return <RegisterPage />;
  if (page === 'landing' || page === '') return <LandingPage />;
  if (page === '403') return <AccessDenied />;

  // Enforce Authentication
  if (!user) return <LoginPage />;

  // Protected Routes Mappings per Role
  // Valid roles: user | faculty | admin
  // Mentor status is per-skill (MentorSkill collection) — NOT a separate role.
  const roleMap = {
    admin: ['admin', 'dashboard', 'settings', 'faculty', 'students-admin', 'mentors-admin', 'faculty-admin', 'skills', 'analytics', 'reports', 'announcements', 'profile', 'book-session', 'bookings', 'mentor-assessment', 'marketplace', 'leaderboard', 'messages', 'mentor', 'mentor-verification', 'students'],
    faculty: ['faculty', 'dashboard', 'skills', 'mentor-verification', 'reports', 'announcements', 'profile', 'students'],
    user: ['dashboard', 'marketplace', 'skills', 'bookings', 'my-bookings', 'mybookings', 'messages', 'leaderboard', 'profile', 'mentor', 'mentor-assessment', 'book-session', 'booksession', 'mentor-profile', 'students', 'reports', 'announcements'],
  };

  // Clean variations
  const reqPage = ['booksession', 'my-bookings', 'mybookings'].includes(page)
    ? (page === 'booksession' ? 'book-session' : 'bookings')
    : page;

  const allowedPages = roleMap[role] || [];

  if (!allowedPages.includes(reqPage)) {
    return <AccessDenied />;
  }

  // Render authorized pages
  if (page === 'dashboard') return <DashboardPage />;
  if (page === 'marketplace' || page === 'skills') return <MarketplacePage />;
  if (page === 'faculty' || page === 'mentor-verification') return <FacultyDashboardPage />;
  if (page === 'admin') return <AdminDashboardPage />;
  if (page === 'messages') return <MessagesPage />;
  if (page === 'leaderboard') return <LeaderboardPage />;
  if (page === 'profile') return <ProfilePage />;
  if (page === 'settings') return <SettingsPage />;
  if (page === 'mentor') return <BecomeMentorPage />;
  if (page === 'mentor-assessment') return <MentorAssessmentPage />;
  if (page === 'mentor-profile') return <MentorProfilePage />;
  if (page === 'students' || page === 'students-admin' || page === 'mentors-admin' || page === 'faculty-admin') return <MyStudentsPage />;
  if (page === 'reports' || page === 'analytics') return <ReportsPage />;
  if (page === 'announcements') return <AnnouncementsPage />;
  if (page === 'book-session' || page === 'booksession') return <BookSessionPage />;
  if (page === 'my-bookings' || page === 'bookings' || page === 'mybookings') return <MyBookingsPage />;

  return <LandingPage />;
}

export default function App() {
  return (
    <RouterProvider>
      <RouterRoot />
    </RouterProvider>
  );
}
