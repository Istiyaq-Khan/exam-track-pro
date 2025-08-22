'use client';

import { motion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import { 
  AcademicCapIcon, 
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: "Exam Tracking",
      description: "Comprehensive exam management with progress tracking, to-do lists, and deadline reminders."
    },
    {
      icon: BookOpenIcon,
      title: "Study Resources",
      description: "Access to a vast library of textbooks, study materials, and reference books for SSC preparation."
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Community Blog",
      description: "Share experiences, tips, and connect with fellow SSC students through our interactive blog platform."
    },
    {
      icon: HeartIcon,
      title: "AI Motivation",
      description: "Get personalized motivational advice and study tips powered by advanced AI technology."
    },
    {
      icon: UserGroupIcon,
      title: "Student Community",
      description: "Join a supportive community of SSC students working towards their academic goals."
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Platform",
      description: "Your data is protected with industry-standard security measures and privacy controls."
    }
  ];

  const team = [
    {
      name: "Development Team",
      role: "Full-Stack Development",
      description: "Experienced developers building modern web applications with cutting-edge technologies."
    },
    {
      name: "Educational Experts",
      role: "SSC Curriculum Specialists",
      description: "Education professionals ensuring content relevance and accuracy for SSC students."
    },
    {
      name: "AI Integration",
      role: "Gemini AI Implementation",
      description: "Advanced AI integration for personalized learning support and motivational guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
              <AcademicCapIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-blue-500">SSC Exam Pro</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            We're dedicated to revolutionizing SSC exam preparation by providing students with 
            comprehensive tools, resources, and support to achieve their academic goals.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            To empower every SSC student with the tools, knowledge, and motivation they need to 
            excel in their examinations and build a strong foundation for their future academic journey.
          </p>
        </motion.div>

        {/* What We Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What We Offer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Helps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How SSC Exam Pro Helps Students
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">📚 Organized Learning</h3>
                <p className="text-gray-400">
                  Structure your study schedule with our comprehensive exam tracking system. 
                  Never miss important deadlines or forget to study key subjects.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">🎯 Progress Monitoring</h3>
                <p className="text-gray-400">
                  Track your progress in real-time with visual charts and completion percentages. 
                  Stay motivated by seeing your improvement over time.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">💡 Smart Reminders</h3>
                <p className="text-gray-400">
                  Get timely notifications about upcoming exams, study sessions, and daily tasks. 
                  Stay on top of your preparation schedule.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">🤝 Community Support</h3>
                <p className="text-gray-400">
                  Connect with fellow SSC students, share experiences, and learn from each other's 
                  study strategies and exam preparation tips.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">🧠 AI-Powered Motivation</h3>
                <p className="text-gray-400">
                  Get personalized motivational advice and study tips from our advanced AI system. 
                  Overcome challenges with intelligent guidance.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">📖 Rich Resources</h3>
                <p className="text-gray-400">
                  Access a comprehensive library of study materials, textbooks, and reference books 
                  specifically curated for SSC exam preparation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-gray-400">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="bg-gray-800 rounded-lg p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Get in Touch
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📧</span>
                  </div>
                  <span className="text-gray-300">support@sscexampro.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🌐</span>
                  </div>
                  <span className="text-gray-300">www.sscexampro.com</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-3">Office Hours</h4>
                <p className="text-gray-400">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your SSC Preparation?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of students who are already using SSC Exam Pro to ace their exams!
          </p>
          <div className="space-x-4">
            <a
              href="/exams"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-block"
            >
              Get Started
            </a>
            <a
              href="/blogs"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-block"
            >
              Explore Community
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 