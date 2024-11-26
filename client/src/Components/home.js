import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, LogIn, LogOut, Shield, Lock, Cpu, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Auth/Firebase';
import { motion, useAnimation, useInView } from 'framer-motion';

const ServiceIcon = ({ icon: Icon, className }) => (
  <div className="mb-4 bg-gradient-to-br from-blue-500/20 to-green-500/20 p-4 rounded-full inline-block">
    <Icon className={`h-10 w-10 text-blue-400 ${className}`} />
  </div>
);

const Home = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const serviceRef = useRef(null);
  const isServiceInView = useInView(serviceRef, { once: true });
  const serviceControls = useAnimation();

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    if (isServiceInView) {
      serviceControls.start('visible');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, [isServiceInView, serviceControls]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLogin = () => {
    if (isLoggedIn) {
      auth.signOut().then(() => {
        setIsLoggedIn(false);
        navigate('/');
      });
    } else {
      navigate('/login');
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const serviceItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? 'backdrop-blur-sm bg-opacity-80 border-b border-gray-700' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLogin}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-700"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </>
              )}
            </motion.button>
            <div className="flex-1 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-600 bg-clip-text text-transparent"
              >
                Levault
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="sm:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="sm:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="pt-16 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-600 bg-clip-text text-transparent">
              Empowering Cybersecurity Solutions
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto">
              Protecting your digital world with cutting-edge defense systems and expert solutions.
            </p>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-600 rounded-lg font-semibold text-white transform transition-transform duration-200"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        ref={serviceRef}
        initial="hidden"
        animate={serviceControls}
        variants={serviceVariants}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-green-600 bg-clip-text text-transparent">
            Core Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Network Security', 
                description: 'Advanced protection for your digital infrastructure.',
                icon: Shield 
              },
              { 
                name: 'Threat Analysis', 
                description: 'Comprehensive risk assessment and mitigation strategies.',
                icon: Lock 
              },
              { 
                name: 'Incident Response', 
                description: 'Rapid and effective handling of security breaches.',
                icon: Cpu 
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={serviceItemVariants}
                className="p-8 rounded-xl bg-gray-800 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center"
              >
                <ServiceIcon icon={service.icon} />
                <h3 className="text-xl font-semibold mb-4">{service.name}</h3>
                <p className="text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;