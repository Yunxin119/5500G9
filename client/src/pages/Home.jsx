import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Home = () => {
  const { userInfo } = useSelector((state) => state.authReducer);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className='w-screen h-screen flex flex-col overflow-hidden bg-gray-200 dark:bg-gray-800 dark:bg-opacity-15 bg-opacity-15'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Navbar />
      <div className="relative isolate px-6 lg:px-8">
        <motion.div 
          className="flex flex-col items-center justify-center mx-auto max-w-2xl py-40 sm:py-32 lg:py-48"
          variants={containerVariants}
        >
          <div className="text-center">
            <motion.h1 
              className="text-balance text-5xl lg:text-7xl font-semibold tracking-tight text-gray-900 dark:text-gray-300 sm:text-5xl"
              variants={itemVariants}
            >
              Keep track of every application
            </motion.h1>
            
            <motion.p 
              className="mt-8 text-pretty text-lg font-medium text-gray-800 dark:text-gray-300 text-opacity-80 sm:text-lg"
              variants={itemVariants}
            >
              It's never been easier to keep track of your job applications. With JobHunter, 
              you can keep track of every job you apply to, every interview you have, and every 
              offer you receive.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-6"
              variants={itemVariants}
            >
              {userInfo ? (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/applications"
                    className="rounded-xl bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/register"
                    className="rounded-xl bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up for free
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Optional: Add a subtle background animation */}
        <motion.div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            transition: {
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;