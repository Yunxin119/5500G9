import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useGenerateCoverLetterMutation } from '../../redux/userApiSlice';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CoverLetterGeneration = ({ resume, jd, pdfText }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generateCoverLetter] = useGenerateCoverLetterMutation();
  const markdownRef = React.useRef(null);

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

  const handleGenerateCoverLetter = async () => {
    if (!resume && !pdfText) {
      toast.error('Please upload your resume or provide resume text');
      return;
    }

    if (!jd) {
      toast.error('Please provide a job description');
      return;
    }

    setLoading(true);
    try {
      const response = await generateCoverLetter({
        resume,
        jobDescription: jd,
        pdfText
      }).unwrap();

      if (response && response.coverLetter) {
        setCoverLetter(response.coverLetter);
        toast.success('Cover letter generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      toast.error('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy to clipboard');
      });
  };

  const handleDownloadPDF = async () => {
    if (!coverLetter) {
      toast.error('No cover letter to download');
      return;
    }

    try {
      const element = markdownRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cover-letter.pdf');
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to download PDF');
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

      {!coverLetter && (
        <motion.button
          onClick={handleGenerateCoverLetter}
          disabled={loading}
          whileHover={{ scale: 1.02, backgroundColor: loading ? "rgb(59, 130, 246, 0.5)" : "rgb(59, 130, 246)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`w-full p-3 ${loading ? 'bg-blue-500/50' : 'bg-blue-500'} text-white rounded-lg font-medium
                    shadow-lg shadow-blue-500/20 flex items-center justify-center
                    space-x-2 hover:shadow-xl hover:shadow-blue-500/30
                    transition-shadow duration-300 mb-4`}
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </motion.button>
      )}

      <motion.div 
        className="relative bg-gray-500/50 backdrop-blur-md border border-gray-700/50 rounded-lg overflow-hidden"
        variants={itemVariants}
      >
        {coverLetter ? (
          <div 
            ref={markdownRef}
            className="p-6 prose prose-invert prose-blue max-w-none h-[500px] overflow-y-auto sec-text markdown-content"
          >
            <ReactMarkdown>
              {coverLetter}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="p-6 h-[500px] overflow-y-auto flex items-center justify-center text-center">
            <p className="sec-text text-gray-400">
              {loading ? 'Generating your cover letter...' : 'Your professionally crafted cover letter will appear here...'}
            </p>
          </div>
        )}
      </motion.div>

      {coverLetter && (
        <motion.div 
          className='flex flex-col sm:flex-row justify-center gap-4 mt-6'
          variants={itemVariants}
        >
          <motion.button
            onClick={handleDownloadPDF}
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
            onClick={handleCopyToClipboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className='flex-1 p-3 bg-gray-700/40 backdrop-blur-md text-white rounded-lg
                      font-medium shadow-lg flex items-center justify-center space-x-2
                      hover:bg-gray-600/40 transition-all duration-300'
          >
            {copied ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoverLetterGeneration;