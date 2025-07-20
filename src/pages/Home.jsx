import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackPageView, trackButtonClick, trackUserEngagement } from '../utils/analytics';

const { FiTarget, FiEye, FiTrendingUp, FiShield, FiZap, FiCheck, FiArrowRight } = FiIcons;

const Home = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [problemRef, problemInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [solutionRef, solutionInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [socialProofRef, socialProofInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Page tracking and analytics setup
  useEffect(() => {
    // Set page title for better tracking
    document.title = 'Home - Secret Agent Digital Marketing';
    
    // Track page view
    trackPageView('/', 'Home - Secret Agent Digital Marketing');
    
    // Track page load event with Google Analytics 4
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_load', {
        event_category: 'engagement',
        event_label: 'home_page',
        page_location: window.location.href
      });
      console.log('🏠 Home page analytics initialized');
    }
  }, []);

  // Track section views
  useEffect(() => {
    if (heroInView) trackUserEngagement('section_view', 'hero_section');
  }, [heroInView]);
  
  useEffect(() => {
    if (problemInView) trackUserEngagement('section_view', 'problem_section');
  }, [problemInView]);
  
  useEffect(() => {
    if (solutionInView) trackUserEngagement('section_view', 'solution_section');
  }, [solutionInView]);
  
  useEffect(() => {
    if (benefitsInView) trackUserEngagement('section_view', 'benefits_section');
  }, [benefitsInView]);
  
  useEffect(() => {
    if (socialProofInView) trackUserEngagement('section_view', 'social_proof_section');
  }, [socialProofInView]);

  const trackCtaClick = (ctaName, location) => {
    trackButtonClick(ctaName, location, {
      cta_type: 'primary',
      page: 'home'
    });
  };

  const benefits = [
    {
      icon: FiTarget,
      title: 'Precision Targeting',
      description: 'Identify and engage your ideal customers with pinpoint accuracy using advanced data and AI insights.'
    },
    {
      icon: FiEye,
      title: 'Transparent Reporting',
      description: 'Access real-time performance dashboards and ROI tracking—no more guessing games.'
    },
    {
      icon: FiTrendingUp,
      title: 'Under-Promise, Over-Deliver',
      description: 'We set realistic expectations and then exceed them consistently with measurable results.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Johnson Real Estate',
      text: 'Tie and his team transformed our lead generation. We went from 5 leads per month to 47 in just 60 days.',
      industry: 'Real Estate'
    },
    {
      name: 'Mike Chen',
      company: 'Chen\'s Auto Repair',
      text: 'Their local SEO strategies put us on the map. We\'re now the #1 auto shop in our area on Google.',
      industry: 'Automotive'
    },
    {
      name: 'Dr. Amanda Smith',
      company: 'Smith Family Dental',
      text: 'Professional, strategic, and results-driven. Our patient bookings increased 200% in 3 months.',
      industry: 'Healthcare'
    }
  ];

  const industries = [
    'Healthcare', 'Real Estate', 'E-commerce', 'Legal', 
    'Finance', 'Automotive', 'Home Services', 'Restaurants'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-bg min-h-screen flex items-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-display font-bold mb-6 glow-text"
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Stealth Strategies.<br />
              <span className="gradient-text">Real Results.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Tired of agencies with vague promises and cookie-cutter tactics? We tailor powerful, ROI-driven digital campaigns that get results.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/contact" 
                className="px-8 py-4 btn-primary rounded-lg font-semibold text-lg flex items-center space-x-2 animate-pulse-red"
                onClick={() => trackCtaClick('Start Your Mission', 'hero_primary')}
              >
                <span>Start Your Mission</span>
                <SafeIcon icon={FiArrowRight} />
              </Link>
              
              <Link 
                to="/case-studies" 
                className="px-8 py-4 border-2 border-tactical-red text-tactical-red rounded-lg font-semibold text-lg hover:bg-tactical-red hover:text-white transition-all duration-300"
                onClick={() => trackCtaClick('View Case Studies', 'hero_secondary')}
              >
                View Case Studies
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains the same */}
      {/* Problem Section */}
      <section ref={problemRef} className="py-20 bg-dark-gray">
        {/* Content */}
      </section>

      {/* Solution Section */}
      <section ref={solutionRef} className="py-20 bg-jet-black">
        {/* Content */}
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-dark-gray">
        {/* Content */}
      </section>

      {/* Social Proof Section */}
      <section ref={socialProofRef} className="py-20 bg-jet-black">
        {/* Content */}
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-tactical-red">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Ready to Outperform Your Competitors?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Limited onboarding slots available this quarter. Under-promise, over-deliver—that's our guarantee.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-tactical-red rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              onClick={() => trackCtaClick('Launch Your Strategy Call Now', 'final_cta')}
            >
              <span>Launch Your Strategy Call Now</span>
              <SafeIcon icon={FiArrowRight} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;