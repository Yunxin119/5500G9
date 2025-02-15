import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiBriefcase, FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

const InfoInput = ({ setResume, setJd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setUploadedFile(file);
      // Here you would typically read the file and set the resume
      const reader = new FileReader();
      reader.onload = (e) => {
        setResume(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResume('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      className='flex flex-col w-full md:w-1/2 p-6 space-y-4'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center justify-between mb-2"
        variants={itemVariants}
      >
        <h2 className='text-2xl font-bold sec-text'>
          Input Information
        </h2>
        <div className="text-sm hint">Both fields required</div>
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2 sec-text text-sm font-medium mb-2">
            <FiFileText className="w-4 h-4" />
            <span>Your Resume</span>
          </div>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300
                      ${isDragging 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-200 bg-gray-500/50 backdrop-blur-md hover:border-blue-500/50'} 
                      backdrop-blur-md hover:border-blue-500/50`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,.doc,.docx"
            />
            
            {!uploadedFile ? (
              <div className="flex flex-col items-center justify-center py-4">
                <FiUploadCloud className="w-10 h-10 sec-text mb-2" />
                <p className="sec-text text-sm mb-1">
                  Drag and drop your resume here, or{' '}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    browse
                  </button>
                </p>
                <p className="sec-text text-xs">
                  Supports PDF, DOC, DOCX
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <FiFile className="w-6 h-6 text-blue-500" />
                  <span className="sec-text text-sm">{uploadedFile.name}</span>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <FiX className="w-5 h-5 sec-text hover:sec-text" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 sec-text text-sm font-medium mb-2">
            <FiBriefcase className="w-4 h-4" />
            <span>Job Description</span>
          </div>
          <textarea
            className='w-full p-6 rounded-lg text-area bg-gray-800/50 backdrop-blur-md
                       border border-gray-700/50 focus:border-blue-500/50 focus:ring-2 
                       focus:ring-blue-500/20 focus:outline-none transition-all duration-300
                       sec-text placeholder'
            placeholder='Paste the job description here...'
            rows={10}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InfoInput;