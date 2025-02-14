import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredential } from '../redux/authReducer';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setCredential({ email, password }));
    navigate('/');
  };

  const containerVariants = {
    hidden: { y: 20 },
    visible: {
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const inputClasses = "mt-1 input transition-all duration-300 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50";

  return (
    <motion.div 
      className="flex h-screen p-4 items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
        <motion.div 
          className="bg-gray-450 w-full p-6 rounded-lg shadow-lg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0"
          whileHover={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)" }}
        >
          {/* Title */}
          <motion.h1 
            className="text-3xl font-bold text-center text-gray-200"
            variants={itemVariants}
          >
            Login
            <motion.span 
              className="text-blue-600 ml-2"
              whileHover={{ color: "#60A5FA" }}
            >
              OfferHunter
            </motion.span>
          </motion.h1>

          {/* Form */}
          <motion.form 
            className="flex flex-col p-2 mt-2 space-y-4"
            onSubmit={submitHandler}
          >
            {/* Form: Email */}
            <motion.div variants={itemVariants}>
              <label className="label py-2 prime-text">
                <span>Email</span>
              </label>
              <motion.input
                type="email"
                placeholder="Who goes there?"
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileHover={{ x: 5 }}
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            {/* Form: Password */}
            <motion.div variants={itemVariants}>
              <label className="label py-2 prime-text">
                <span>Password</span>
              </label>
              <motion.input
                type="password"
                placeholder="Shh... it's a secret"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileHover={{ x: 5 }}
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            {/* Form: Register direction */}
            <motion.div 
              className="py-2 items-center justify-center text-center"
              variants={itemVariants}
            >
              <Link to="/register" className="text-white group">
                New here?{' '}
                <motion.span 
                  className="text-blue-600"
                  whileHover={{ color: "#60A5FA" }}
                >
                  Let's get you started.
                </motion.span>
              </Link>
            </motion.div>

            {/* Form: Submit */}
            <motion.button
              type="submit"
              className="rounded-full bg-blue-600 mt-2 px-4 py-2.5 text-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              Login
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;