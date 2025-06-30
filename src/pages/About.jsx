import React from 'react';
import {motion} from 'framer-motion';
import {Link} from 'react-router-dom';
import {useInView} from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiShield,FiTrendingUp,FiZap,FiHeart,FiTarget,FiUsers,FiArrowRight} = FiIcons;

const About = () => {
  const [heroRef, heroInView] = useInView({threshold: 0.1, triggerOnce: true});
  const [storyRef, storyInView] = useInView({threshold: 0.1, triggerOnce: true});
  const [valuesRef, valuesInView] = useInView({threshold: 0.1, triggerOnce: true});
  const [teamRef, teamInView] = useInView({threshold: 0.1, triggerOnce: true});

  const values = [
    {
      icon: FiShield,
      title: 'Integrity',
      description: 'We operate with complete transparency and honesty in every client relationship, guided by Christian values.'
    },
    {
      icon: FiTrendingUp,
      title: 'Under-Promise, Over-Deliver',
      description: 'Results speak louder than promises. We set realistic expectations and exceed them consistently.'
    },
    {
      icon: FiZap,
      title: 'Fighter\'s Mentality',
      description: 'We approach every challenge with the same intensity and determination as an MMA fighter in the ring.'
    }
  ];

  const teamMembers = [
    {
      name: 'Tie "The Fighter" Staton',
      role: 'Founder & Chief Strategy Officer',
      bio: 'Former firefighter turned digital marketing strategist. Tie brings the same life-saving urgency to your marketing campaigns that he once brought to emergency rescues.',
      specialties: ['Strategic Planning', 'Crisis Management', 'Team Leadership'],
      background: 'Firefighter → Digital Marketing Expert'
    },
    {
      name: 'Sarah "Data Ninja" Chen',
      role: 'Analytics & Performance Director',
      bio: 'Data scientist with 8+ years optimizing campaigns. She finds opportunities others miss in the numbers.',
      specialties: ['Data Analysis', 'Performance Optimization', 'ROI Tracking'],
      background: 'Data Science & Analytics'
    },
    {
      name: 'Jake "Creative Ops" Thompson',
      role: 'Creative & Content Lead',
      bio: 'Award-winning creative director who transforms brand stories into conversion-driving content.',
      specialties: ['Brand Strategy', 'Content Creation', 'Visual Design'],
      background: 'Creative Direction & Branding'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{opacity: 0, y: 50}}
            animate={heroInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8}}
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

      {/* Tie's Origin Story */}
      <section ref={storyRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{opacity: 0, x: -50}}
              animate={storyInView ? {opacity: 1, x: 0} : {}}
              transition={{duration: 0.8}}
            >
              <div className="relative w-full h-96 rounded-lg tactical-border overflow-hidden">
                <img 
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751100821048-Tie%20picturesmart%20crop%2840%20x%2040%20px%29%20%28280%20x%20280%20px%29%20%28300%20x%20300%20px%29.png"
                  alt="Tie Staton - Founder of Secret Agent Digital Marketing"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center bottom',
                    objectFit: 'contain',
                    transform: 'scale(0.7)',
                    transformOrigin: 'center bottom'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg font-bold">Tie Staton</p>
                  <p className="text-tactical-red text-sm">Former Firefighter • MMA Fighter • Racecar Driver</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{opacity: 0, x: 50}}
              animate={storyInView ? {opacity: 1, x: 0} : {}}
              transition={{duration: 0.8, delay: 0.2}}
            >
              <h2 className="text-4xl font-display font-bold mb-6">
                From Saving Lives to <span className="text-tactical-red">Saving Businesses</span>
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-tactical-red">Tie Staton</strong>, a former firefighter, founded Secret Agent Digital Marketing 
                  to help small businesses overcome challenges posed by ineffective marketing and unreliable personnel.
                </p>
                <p>
                  Tie transitioned from saving lives as a firefighter to saving businesses through digital marketing, 
                  applying the same precision, urgency, and life-or-death mentality to every campaign.
                </p>
                <p>
                  Driven by a passion for MMA and a fighter's mentality, Tie has also thrived as an amateur racecar driver. 
                  This unique combination of high-pressure experience gives him an unmatched perspective on performance under pressure.
                </p>
                <p>
                  <strong className="text-tactical-red">As a devout Christian</strong>, Tie approaches every client relationship 
                  with integrity, transparency, and a steadfast dedication to achieving results.
                </p>
                <div className="bg-tactical-red/10 p-4 rounded-lg border border-tactical-red/30 mt-6">
                  <p className="text-tactical-red font-semibold italic">
                    "Our Mission: We aim to become our ideal marketing agency while facing the challenges of being business owners. 
                    Under-promise and over-deliver."
                  </p>
                  <p className="text-gray-400 text-sm mt-2">- Tie Staton, Founder</p>
                </div>
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
            initial={{opacity: 0, y: 50}}
            animate={valuesInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8}}
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
                initial={{opacity: 0, y: 50}}
                animate={valuesInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.6, delay: index * 0.2}}
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
            initial={{opacity: 0, y: 50}}
            animate={teamInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8}}
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
                initial={{opacity: 0, y: 50}}
                animate={teamInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.6, delay: index * 0.2}}
              >
                <div className="w-24 h-24 bg-tactical-red/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <SafeIcon icon={FiUsers} className="text-tactical-red text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{member.name}</h3>
                <p className="text-tactical-red font-semibold text-center mb-2">{member.role}</p>
                <p className="text-gray-400 text-xs text-center mb-4">{member.background}</p>
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
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
          >
            <h2 className="text-4xl font-display font-bold mb-8">
              Mission <span className="text-tactical-red">Statistics</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {number: '150+', label: 'Successful Missions'},
              {number: '300%', label: 'Average ROI Increase'},
              {number: '24/7', label: 'Mission Support'},
              {number: '98%', label: 'Client Satisfaction'}
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6, delay: index * 0.1}}
                viewport={{once: true}}
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
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
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