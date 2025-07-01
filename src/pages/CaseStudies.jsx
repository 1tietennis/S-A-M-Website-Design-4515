import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackPageView, trackButtonClick } from '../utils/analytics';

const { FiTrendingUp, FiTarget, FiUsers, FiDollarSign, FiArrowUp, FiArrowRight, FiCalendar } = FiIcons;

const CaseStudies = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [casesRef, casesInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Google Analytics Test & Page Tracking
  useEffect(() => {
    if (window.gtag) {
      console.log('✅ Google Analytics loaded on Case Studies page');
      window.gtag('config', 'G-CTDQQ8XMKC', {
        page_title: 'Case Studies - Secret Agent Digital Marketing',
        page_location: window.location.href
      });
      window.gtag('event', 'page_load', {
        event_category: 'engagement',
        event_label: 'case_studies_page'
      });
    }
    trackPageView('/case-studies', 'Case Studies - Secret Agent Digital Marketing');
  }, []);

  const caseStudies = [
    {
      title: 'Johnson Real Estate: Lead Generation Domination',
      industry: 'Real Estate',
      challenge: 'Struggling with only 5 qualified leads per month and high cost-per-acquisition',
      solution: 'Implemented targeted Facebook and Google Ads with custom landing pages and CRM automation',
      results: [
        { metric: 'Monthly Leads', before: '5', after: '47', increase: '840%' },
        { metric: 'Cost Per Lead', before: '$180', after: '$38', decrease: '79%' },
        { metric: 'Conversion Rate', before: '2.1%', after: '8.7%', increase: '314%' }
      ],
      timeline: '60 days',
      testimonial: "Secret Agent Digital transformed our lead generation. We went from struggling to find clients to having a waiting list.",
      client: 'Sarah Johnson, Broker'
    },
    {
      title: 'Chen\'s Auto Repair: Local SEO Breakthrough',
      industry: 'Automotive',
      challenge: 'Invisible in local search results, losing customers to competitors',
      solution: 'Comprehensive local SEO strategy with Google My Business optimization and reputation management',
      results: [
        { metric: 'Google Ranking', before: 'Page 3', after: '#1 Position', increase: 'Top 3' },
        { metric: 'Monthly Calls', before: '12', after: '89', increase: '642%' },
        { metric: 'Online Reviews', before: '3.2 stars', after: '4.8 stars', increase: '50%' }
      ],
      timeline: '90 days',
      testimonial: "We're now the #1 auto shop in our area on Google. Our phone doesn't stop ringing!",
      client: 'Mike Chen, Owner'
    },
    {
      title: 'Smith Family Dental: Patient Acquisition System',
      industry: 'Healthcare',
      challenge: 'Difficulty attracting new patients and maintaining consistent bookings',
      solution: 'Multi-channel approach with social media advertising, content marketing, and automated booking system',
      results: [
        { metric: 'New Patients', before: '8/month', after: '24/month', increase: '200%' },
        { metric: 'Booking Rate', before: '45%', after: '78%', increase: '73%' },
        { metric: 'Revenue Growth', before: 'Baseline', after: '+$85K', increase: '35%' }
      ],
      timeline: '120 days',
      testimonial: "Professional, strategic, and results-driven. Our patient bookings increased 200% in 3 months.",
      client: 'Dr. Amanda Smith'
    }
  ];

  const metrics = [
    { icon: FiTrendingUp, value: '300%', label: 'Average ROI Increase' },
    { icon: FiUsers, value: '150+', label: 'Successful Campaigns' },
    { icon: FiTarget, value: '89%', label: 'Goal Achievement Rate' },
    { icon: FiDollarSign, value: '$2.5M+', label: 'Client Revenue Generated' }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Google tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-CTDQQ8XMKC"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CTDQQ8XMKC');
          console.log('Case Studies page Google Analytics loaded');
        `
      }} />

      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Mission <span className="gradient-text">Success Stories</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Real results from real businesses. See how our strategic approach transforms marketing challenges into measurable victories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metrics Overview */}
      <section className="py-16 bg-tactical-red">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div 
                key={index}
                className="text-center text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <SafeIcon icon={metric.icon} className="text-4xl mb-3 mx-auto" />
                <div className="text-3xl font-display font-bold mb-2">{metric.value}</div>
                <div className="text-white/90 text-sm">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section ref={casesRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <motion.div 
                key={index}
                className="bg-medium-gray rounded-lg p-8 tactical-border"
                initial={{ opacity: 0, y: 50 }}
                animate={casesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Story */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-3 py-1 bg-tactical-red/20 text-tactical-red rounded-full text-sm font-semibold">
                        {study.industry}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <SafeIcon icon={FiCalendar} />
                        <span>Completed in {study.timeline}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">{study.title}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-tactical-red font-semibold mb-2">The Challenge:</h4>
                        <p className="text-gray-300">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-tactical-red font-semibold mb-2">Our Solution:</h4>
                        <p className="text-gray-300">{study.solution}</p>
                      </div>
                      
                      <div className="bg-dark-gray p-4 rounded-lg">
                        <p className="text-gray-300 italic">"{study.testimonial}"</p>
                        <p className="text-tactical-red font-semibold mt-2">- {study.client}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Results */}
                  <div>
                    <h4 className="text-xl font-bold mb-6 text-center">Mission Results</h4>
                    <div className="space-y-4">
                      {study.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="bg-dark-gray p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">{result.metric}</span>
                            <div className="flex items-center space-x-1 text-green-400">
                              <SafeIcon icon={FiArrowUp} />
                              <span className="font-bold">{result.increase || result.decrease}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Before: {result.before}</span>
                            <span className="text-tactical-red font-semibold">After: {result.after}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Our Proven <span className="text-tactical-red">Battle Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every successful mission follows the same strategic protocol that delivers consistent results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Reconnaissance', desc: 'Deep market analysis and competitor intelligence gathering', duration: 'Week 1' },
              { step: '02', title: 'Strategy Formation', desc: 'Custom battle plan development with clear objectives and KPIs', duration: 'Week 2' },
              { step: '03', title: 'Tactical Deployment', desc: 'Campaign launch across all selected marketing channels', duration: 'Week 3-4' },
              { step: '04', title: 'Optimization & Scale', desc: 'Continuous monitoring, testing, and performance enhancement', duration: 'Ongoing' }
            ].map((phase, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 bg-dark-gray rounded-lg tactical-border"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-display font-bold text-tactical-red mb-4">{phase.step}</div>
                <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                <p className="text-gray-400 mb-3">{phase.desc}</p>
                <span className="text-tactical-red text-sm font-semibold">{phase.duration}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join the ranks of businesses that have transformed their marketing results with our proven strategies.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-tactical-red rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              onClick={() => trackButtonClick('Start Your Success Story', 'case-studies-cta')}
            >
              <span>Start Your Success Story</span>
              <SafeIcon icon={FiArrowRight} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;