import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackPageView, trackButtonClick } from '../utils/analytics';

const { FiSearch, FiTarget, FiUsers, FiStar, FiSettings, FiEdit3, FiArrowRight } = FiIcons;

const Services = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Google Analytics Test & Page Tracking
  useEffect(() => {
    if (window.gtag) {
      console.log('✅ Google Analytics loaded on Services page');
      window.gtag('config', 'G-CTDQQ8XMKC', {
        page_title: 'Services - Secret Agent Digital Marketing',
        page_location: window.location.href
      });
      window.gtag('event', 'page_load', {
        event_category: 'engagement',
        event_label: 'services_page'
      });
    }
    trackPageView('/services', 'Services - Secret Agent Digital Marketing');
  }, []);

  const services = [
    {
      icon: FiSearch,
      title: 'SEO & Local Optimization',
      description: 'Dominate local search results and drive qualified traffic to your business with our proven SEO strategies.',
      features: [
        'Local SEO optimization',
        'Keyword research & targeting',
        'Technical SEO audits',
        'Content optimization'
      ],
      price: 'Starting at $997/month'
    },
    {
      icon: FiTarget,
      title: 'Paid Ads (Meta, Google, TikTok)',
      description: 'Precision-targeted advertising campaigns that maximize ROI and convert prospects into customers.',
      features: [
        'Campaign strategy & setup',
        'Ad creative development',
        'Audience targeting',
        'Performance optimization'
      ],
      price: 'Starting at $1,497/month'
    },
    {
      icon: FiUsers,
      title: 'Social Media Management',
      description: 'Build a powerful brand presence across all social platforms with engaging content and community management.',
      features: [
        'Content creation & scheduling',
        'Community management',
        'Social media strategy',
        'Performance analytics'
      ],
      price: 'Starting at $797/month'
    },
    {
      icon: FiStar,
      title: 'Reputation Management',
      description: 'Protect and enhance your online reputation with proactive monitoring and strategic response management.',
      features: [
        'Online review monitoring',
        'Review response management',
        'Reputation repair strategies',
        'Brand sentiment tracking'
      ],
      price: 'Starting at $597/month'
    },
    {
      icon: FiSettings,
      title: 'CRM Automation & Funnels',
      description: 'Streamline your sales process with automated workflows and high-converting sales funnels.',
      features: [
        'Sales funnel creation',
        'Email automation',
        'Lead nurturing sequences',
        'CRM integration'
      ],
      price: 'Starting at $1,297/month'
    },
    {
      icon: FiEdit3,
      title: 'AI-Powered Copy & Content',
      description: 'Compelling copy and content that converts, powered by AI insights and human creativity.',
      features: [
        'Website copywriting',
        'Ad copy creation',
        'Content strategy',
        'AI-powered optimization'
      ],
      price: 'Starting at $697/month'
    }
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
          console.log('Services page Google Analytics loaded');
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
              Elite <span className="gradient-text">Marketing Arsenal</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our comprehensive suite of digital marketing services designed to dominate your market and deliver measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="bg-medium-gray rounded-lg p-8 tactical-border card-hover"
                initial={{ opacity: 0, y: 50 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-center mb-6">
                  <SafeIcon icon={service.icon} className="text-tactical-red text-4xl mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-tactical-red">What's Included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-tactical-red rounded-full"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-tactical-red font-bold text-lg mb-4">{service.price}</p>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center space-x-2 px-6 py-3 btn-primary rounded-lg font-semibold"
                    onClick={() => trackButtonClick(`Get Started - ${service.title}`, 'services')}
                  >
                    <span>Get Started</span>
                    <SafeIcon icon={FiArrowRight} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our <span className="text-tactical-red">Mission Protocol</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every successful mission follows a proven protocol. Here's how we ensure your marketing success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Intelligence Gathering',
                desc: 'Deep dive into your business, competitors, and market opportunities'
              },
              {
                step: '02',
                title: 'Strategy Development',
                desc: 'Create a custom battle plan tailored to your specific goals and budget'
              },
              {
                step: '03',
                title: 'Mission Execution',
                desc: 'Deploy proven tactics across all selected marketing channels'
              },
              {
                step: '04',
                title: 'Performance Analysis',
                desc: 'Monitor, measure, and optimize for maximum ROI and growth'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-display font-bold text-tactical-red mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
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
              Ready to Deploy Your Marketing Arsenal?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let's discuss which services will deliver the biggest impact for your business.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-tactical-red rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              onClick={() => trackButtonClick('Schedule Strategy Session', 'services-cta')}
            >
              <span>Schedule Strategy Session</span>
              <SafeIcon icon={FiArrowRight} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;