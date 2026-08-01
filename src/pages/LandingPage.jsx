import LandingNav from './landing/LandingNav';
import HeroSection from './landing/HeroSection';
import StatsSection from './landing/StatsSection';
import FeaturesSection from './landing/FeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import LeaderboardSection from './landing/LeaderboardSection';
import TestimonialsSection from './landing/TestimonialsSection';
import FAQSection from './landing/FAQSection';
import FooterSection from './landing/FooterSection';

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', overflowX: 'hidden' }}>
            <LandingNav />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <LeaderboardSection />
            <TestimonialsSection />
            <FAQSection />
            <FooterSection />
        </div>
    );
}
