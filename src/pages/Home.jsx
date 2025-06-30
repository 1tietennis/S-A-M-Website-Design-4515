import React from 'react';
import {motion} from 'framer-motion';
import {Link} from 'react-router-dom';
import {useInView} from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiTarget,FiEye,FiTrendingUp,FiShield,FiZap,FiCheck,FiArrowRight} = FiIcons;

const Home = () => {
  const [heroRef, heroInView] = useInView({threshold: 0.1, triggerOnce: true});
  const [problemRef, problemInView] = useInView({threshold: 0.1, triggerOnce: true});
  const [solutionRef, solutionInView] = useInView({threshold: 0.1, triggerOnce: true});
  const [benefitsRef, benefitsInView] = useInView({threshold: 0.1, triggerOnce: true});
  const [socialProofRef, socialProofInView] = useInView({threshold: 0.1, triggerOnce: true});

  const trackCtaClick = (ctaName, location) => {
    if (window.CyborgCRM) {
      window.CyborgCRM('track', 'click', {
        element: 'cta',
        value: ctaName,
        page: '/',
        section: location
      });
    }
  };

  const trackEngagement = (action, element) => {
    if (window.CyborgCRM) {
      window.CyborgCRM('track', 'engagement', {
        action: action,
        element: element,
        page: '/'
      });
    }
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
    'Healthcare',
    'Real Estate',
    'E-commerce',
    'Legal',
    'Finance',
    'Automotive',
    'Home Services',
    'Restaurants'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="hero-bg min-h-screen flex items-center relative overflow-hidden"
        onViewportEnter={() => trackEngagement('view', 'hero-section')}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-display font-bold mb-6 glow-text"
              initial={{opacity: 0, y: 50}}
              animate={heroInView ? {opacity: 1, y: 0} : {}}
              transition={{duration: 0.8, delay: 0.2}}
            >
              Stealth Strategies.<br />
              <span className="gradient-text">Real Results.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{opacity: 0, y: 30}}
              animate={heroInView ? {opacity: 1, y: 0} : {}}
              transition={{duration: 0.8, delay: 0.4}}
            >
              Tired of agencies with vague promises and cookie-cutter tactics? We tailor powerful, 
              ROI-driven digital campaigns that get results.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{opacity: 0, y: 30}}
              animate={heroInView ? {opacity: 1, y: 0} : {}}
              transition={{duration: 0.8, delay: 0.6}}
            >
              <Link 
                to="/contact" 
                className="px-8 py-4 btn-primary rounded-lg font-semibold text-lg flex items-center space-x-2 animate-pulse-red"
                onClick={() => trackCtaClick('Start Your Mission', 'hero')}
              >
                <span>Start Your Mission</span>
                <SafeIcon icon={FiArrowRight} />
              </Link>
              <Link 
                to="/case-studies" 
                className="px-8 py-4 border-2 border-tactical-red text-tactical-red rounded-lg font-semibold text-lg hover:bg-tactical-red hover:text-white transition-all duration-300"
                onClick={() => trackCtaClick('View Case Studies', 'hero')}
              >
                View Case Studies
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section ref={problemRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{opacity: 0, y: 50}}
            animate={problemInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8}}
            onViewportEnter={() => trackEngagement('view', 'problem-section')}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Tired of These <span className="text-tactical-red">Marketing Frustrations?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {[
                'Wasted ad spend with no clear ROI',
                'Poor communication and delayed responses',
                'One-size-fits-all campaigns that don\'t work',
                'Over-promising agencies that under-deliver'
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 p-6 bg-medium-gray rounded-lg"
                  initial={{opacity: 0, x: -30}}
                  animate={problemInView ? {opacity: 1, x: 0} : {}}
                  transition={{duration: 0.6, delay: index * 0.1}}
                >
                  <div className="w-2 h-2 bg-tactical-red rounded-full flex-shrink-0"></div>
                  <p className="text-lg">{problem}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section ref={solutionRef} className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{opacity: 0, y: 50}}
            animate={solutionInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8}}
            onViewportEnter={() => trackEngagement('view', 'solution-section')}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Meet Your <span className="gradient-text">Elite Task Force</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Secret Agent Digital Marketing is the elite task force solving these frustrations with 
              military precision and a firefighter's urgency. We under-promise and over-deliver on every mission.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: FiShield,
                  title: 'Integrity-Driven',
                  desc: 'Christian values guide every decision'
                },
                {
                  icon: FiEye,
                  title: 'Transparent Reporting',
                  desc: 'Real-time dashboards and clear metrics'
                },
                {
                  icon: FiTarget,
                  title: 'Fighter\'s Mentality',
                  desc: 'MMA-inspired determination and focus'
                },
                {
                  icon: FiZap,
                  title: 'Firefighter Urgency',
                  desc: 'Life-saving speed applied to your campaigns'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-dark-gray rounded-lg card-hover tactical-border"
                  initial={{opacity: 0, y: 30}}
                  animate={solutionInView ? {opacity: 1, y: 0} : {}}
                  transition={{duration: 0.6, delay: index * 0.1}}
                >
                  <SafeIcon icon={item.icon} className="text-tactical-red text-3xl mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{opacity: 0, y: 50}}
            animate={benefitsInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8}}
            onViewportEnter={() => trackEngagement('view', 'benefits-section')}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Three Pillars of <span className="text-tactical-red">Performance</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-medium-gray rounded-lg card-hover"
                initial={{opacity: 0, y: 50}}
                animate={benefitsInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.8, delay: index * 0.2}}
              >
                <div className="float-animation mb-6">
                  <SafeIcon icon={benefit.icon} className="text-tactical-red text-5xl mx-auto" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-300 text-lg">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section ref={socialProofRef} className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{opacity: 0, y: 50}}
            animate={socialProofInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8}}
            onViewportEnter={() => trackEngagement('view', 'social-proof-section')}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Mission <span className="gradient-text">Accomplished</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              See what our clients are saying about their success stories
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 bg-dark-gray rounded-lg tactical-border card-hover"
                initial={{opacity: 0, y: 30}}
                animate={socialProofInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.6, delay: index * 0.2}}
              >
                <div className="mb-4">
                  <span className="text-tactical-red font-semibold text-sm">{testimonial.industry}</span>
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center"
            initial={{opacity: 0, y: 30}}
            animate={socialProofInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8, delay: 0.6}}
          >
            <h3 className="text-2xl font-bold mb-6">Industries We Serve</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {industries.map((industry, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-medium-gray rounded-full text-sm border border-tactical-red/30"
                >
                  {industry}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-tactical-red">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
            onViewportEnter={() => trackEngagement('view', 'final-cta-section')}
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
              onClick={() => trackCtaClick('Launch Your Strategy Call Now', 'final-cta')}
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