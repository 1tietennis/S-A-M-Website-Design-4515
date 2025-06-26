import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiShield, FiTrendingUp, FiZap, FiHeart, FiTarget, FiUsers, FiArrowRight } = FiIcons;

const About = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [storyRef, storyInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [valuesRef, valuesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const values = [
    {
      icon: FiShield,
      title: 'Integrity',
      description: 'We operate with complete transparency and honesty in every client relationship.'
    },
    {
      icon: FiTrendingUp,
      title: 'Performance',
      description: 'Results speak louder than promises. We measure success by your ROI and growth.'
    },
    {
      icon: FiZap,
      title: 'Adaptability',
      description: 'Digital landscapes change rapidly. We stay ahead of trends and pivot when needed.'
    }
  ];

  const teamMembers = [
    {
      name: 'Marcus "Agent Alpha" Rodriguez',
      role: 'Founder & Chief Strategy Officer',
      bio: 'Former firefighter turned digital marketing strategist. Brings the same life-saving urgency to your marketing campaigns.',
      specialties: ['Strategic Planning', 'Crisis Management', 'Team Leadership']
    },
    {
      name: 'Sarah "Data Ninja" Chen',
      role: 'Analytics & Performance Director',
      bio: 'Data scientist with 8+ years optimizing campaigns. She finds opportunities others miss in the numbers.',
      specialties: ['Data Analysis', 'Performance Optimization', 'ROI Tracking']
    },
    {
      name: 'Jake "Creative Ops" Thompson',
      role: 'Creative & Content Lead',
      bio: 'Award-winning creative director who transforms brand stories into conversion-driving content.',
      specialties: ['Brand Strategy', 'Content Creation', 'Visual Design']
    }
  ];

  return (
    <div className="min-h-screen pt-20">
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
              Meet Your <span className="gradient-text">Elite Task Force</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We're not your typical marketing agency. We're a specialized unit of digital marketing operatives 
              dedicated to one mission: delivering measurable results for businesses ready to dominate their market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section ref={storyRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full h-96 bg-medium-gray rounded-lg tactical-border flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiTarget} className="text-tactical-red text-6xl mb-4 mx-auto" />
                  <p className="text-gray-400">Founder Image Placeholder</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-display font-bold mb-6">
                Born from <span className="text-tactical-red">Frustration</span>
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Secret Agent Digital Marketing was founded by Marcus Rodriguez, a former firefighter who 
                  witnessed too many small businesses fail due to ineffective marketing strategies and 
                  untrustworthy agencies.
                </p>
                <p>
                  After transitioning from saving lives to saving businesses, Marcus discovered his true 
                  calling: applying the same precision, urgency, and dedication from firefighting to 
                  digital marketing campaigns.
                </p>
                <p>
                  With an MMA fighter's mindset and Christian values at the core, we approach every 
                  client relationship with integrity, transparency, and an unwavering commitment to results.
                </p>
                <p>
                  <strong className="text-tactical-red">Our Mission:</strong> To be the marketing agency 
                  we wished existed when we were struggling business owners ourselves.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Code (Values) */}
      <section ref={valuesRef} className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Our <span className="text-tactical-red">Code</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These aren't just words on a wall. They're the principles that guide every decision, 
              every strategy, and every client interaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-dark-gray rounded-lg tactical-border card-hover"
                initial={{ opacity: 0, y: 50 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <SafeIcon icon={value.icon} className="text-tactical-red text-5xl mb-6 mx-auto" />
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Meet the <span className="gradient-text">Operatives</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Each team member brings unique skills and expertise to ensure your marketing missions succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-medium-gray rounded-lg p-8 tactical-border card-hover"
                initial={{ opacity: 0, y: 50 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="w-24 h-24 bg-tactical-red/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <SafeIcon icon={FiUsers} className="text-tactical-red text-3xl" />
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-center">{member.name}</h3>
                <p className="text-tactical-red font-semibold text-center mb-4">{member.role}</p>
                <p className="text-gray-300 mb-6 text-sm">{member.bio}</p>
                
                <div>
                  <h4 className="font-semibold mb-2 text-tactical-red">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, specialtyIndex) => (
                      <span
                        key={specialtyIndex}
                        className="px-3 py-1 bg-tactical-red/20 text-tactical-red rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-8">
              Mission <span className="text-tactical-red">Statistics</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '150+', label: 'Successful Missions' },
              { number: '300%', label: 'Average ROI Increase' },
              { number: '24/7', label: 'Mission Support' },
              { number: '98%', label: 'Client Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-tactical-red mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
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
              Ready to Join Forces?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let's discuss how our team can help your business achieve its marketing objectives.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-tactical-red rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              <span>Start Your Mission</span>
              <SafeIcon icon={FiArrowRight} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;