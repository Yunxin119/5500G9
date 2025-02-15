import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCopy } from 'react-icons/fi';

const CoverLetterGeneration = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className='w-full md:w-1/2 p-6 space-y-4'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <label className='text-2xl font-bold sec-text'>Cover Letter</label>
        <div className="text-sm hint">Auto-generated</div>
      </motion.div>

      <motion.div 
        className="relative"
        variants={itemVariants}
      >
        <textarea
          className='w-full p-6 rounded-lg text-area bg-gray-800/50 backdrop-blur-md
                     border border-gray-700/50 focus:border-blue-500/50 focus:ring-2 
                     focus:ring-blue-500/20 focus:outline-none transition-all duration-300
                     sec-text placeholder'
          placeholder='Your professionally crafted cover letter will appear here...'
          rows={18}
        />
      </motion.div>

      <motion.div 
        className='flex flex-col sm:flex-row justify-center gap-4 mt-6'
        variants={itemVariants}
      >
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgb(59, 130, 246)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className='flex-1 p-3 bg-blue-500 text-white rounded-lg font-medium
                     shadow-lg shadow-blue-500/20 flex items-center justify-center
                     space-x-2 hover:shadow-xl hover:shadow-blue-500/30
                     transition-shadow duration-300'
        >
          <FiDownload className="w-5 h-5" />
          <span>Download PDF</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className='flex-1 p-3 bg-gray-700/40 backdrop-blur-md text-white rounded-lg
                     font-medium shadow-lg flex items-center justify-center space-x-2
                     hover:bg-gray-600/40 transition-all duration-300'
        >
          <FiCopy className="w-5 h-5" />
          <span>Copy to Clipboard</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CoverLetterGeneration;