import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackPageView, trackButtonClick } from '../utils/analytics';

const { FiCamera, FiVideo, FiStar, FiSettings, FiPhone, FiArrowRight, FiCheck, FiMapPin } = FiIcons;

const DroneServices = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Google Analytics Test & Page Tracking
  useEffect(() => {
    if (window.gtag) {
      console.log('✅ Google Analytics loaded on Drone Services page');
      window.gtag('config', 'G-CTDQQ8XMKC', {
        page_title: 'Drone Services - Secret Agent Digital Marketing',
        page_location: window.location.href
      });
      window.gtag('event', 'page_load', {
        event_category: 'engagement',
        event_label: 'drone_services_page'
      });
    }
    trackPageView('/drone-services', 'Drone Services - Secret Agent Digital Marketing');
  }, []);

  const dronePackages = [
    {
      icon: FiCamera,
      title: '📸 Basic Aerial Photo Package',
      description: 'Up to 10 high-resolution aerial photos',
      features: [
        'Single location, within small TBD. radius',
        'Ideal for real estate listings, inspections, or marketing highlights',
        'Professional editing included',
        'Full commercial usage rights'
      ],
      price: '$450 est.'
    },
    {
      icon: FiVideo,
      title: '🎬 Basic Aerial Video Package',
      description: 'Up to 30 seconds professionally edited aerial footage',
      features: [
        'Single location',
        'Includes background royalty-free music if desired',
        'Professional editing and transitions',
        'Full commercial usage rights'
      ],
      price: '$595'
    },
    {
      icon: FiStar,
      title: '🏆 Premium Photo & Video Package',
      description: '20+ aerial photos + Up to 2 minutes edited video',
      features: [
        'Multiple vantage points',
        'Edited video with transitions, branding, and music',
        'Great for property showcases, tourism marketing',
        'Construction progress documentation'
      ],
      price: '$750'
    },
    {
      icon: FiSettings,
      title: '🌟 Ultra Showcase Package',
      description: 'Unlimited photos + Up to 5 minutes cinematic footage',
      features: [
        'Customized with logo animations and text overlays',
        'Call-to-action captions included',
        'Drone pilot coordination with your creative director',
        'Premium cinematic editing'
      ],
      price: '$1,500',
      featured: true
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
          console.log('Drone Services page Google Analytics loaded');
        `
      }} />

      {/* Hero Section */}
      <section ref={heroRef} className="hero-bg py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-tactical-red/20 rounded-full border border-tactical-red/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SafeIcon icon={FiCamera} className="text-tactical-red" />
              <span className="text-tactical-red font-semibold">Drone Operations</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="glow-text">Aerial Perspective</span>
              <br />
              <span className="gradient-text">That Elevates Your Brand</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Capture your brand, property, or project from a powerful aerial perspective. 
              All packages include professional editing and full commercial usage rights.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contact"
                className="px-8 py-4 btn-primary rounded-lg font-semibold text-lg flex items-center space-x-2"
                onClick={() => trackButtonClick('Get Drone Quote', 'drone-services-hero')}
              >
                <SafeIcon icon={FiPhone} />
                <span>Get Your Quote</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 border-2 border-tactical-red/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-16 h-16 bg-tactical-red/20 rounded-lg"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Drone <span className="text-tactical-red">Service Packages</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {dronePackages.map((pkg, index) => (
              <motion.div
                key={index}
                className={`bg-medium-gray rounded-lg p-8 tactical-border card-hover relative ${
                  pkg.featured ? 'ring-2 ring-tactical-red' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-tactical-red text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{pkg.title}</h3>
                  <span className="text-tactical-red font-bold text-xl">{pkg.price}</span>
                </div>

                <p className="text-gray-300 mb-6">{pkg.description}</p>

                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-2">
                      <SafeIcon icon={FiCheck} className="text-tactical-red text-sm mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${
                    pkg.featured
                      ? 'btn-primary'
                      : 'border-2 border-tactical-red text-tactical-red hover:bg-tactical-red hover:text-white'
                  }`}
                  onClick={() => trackButtonClick(`Choose ${pkg.title}`, 'drone-services-packages')}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Services Section */}
      <section className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              <span className="gradient-text">🛠️ Custom Drone Services</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              If your project requires special flight authorizations, large-area mapping, live streaming, 
              or multi-site operations, contact us for a custom quote tailored to your exact goals and budget.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: FiMapPin,
                  title: 'Special Authorizations',
                  description: 'Complex airspace clearances and restricted zone permissions'
                },
                {
                  icon: FiSettings,
                  title: 'Large-Area Mapping',
                  description: 'Comprehensive aerial surveys and photogrammetry services'
                },
                {
                  icon: FiVideo,
                  title: 'Live Streaming',
                  description: 'Real-time aerial broadcasting for events and monitoring'
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <SafeIcon icon={service.icon} className="text-tactical-red text-4xl mb-4 mx-auto" />
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Ready to Take Flight?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              📞 Call us today to discuss your vision and receive a complimentary consultation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-tactical-red rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              onClick={() => trackButtonClick('Schedule Drone Consultation', 'drone-services-cta')}
            >
              <SafeIcon icon={FiPhone} />
              <span>Schedule Consultation</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DroneServices;