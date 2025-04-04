import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCopy, FiCheck, FiPlus } from 'react-icons/fi'; // Added FiBriefcase
import ReactMarkdown from 'react-markdown';
import { useGenerateCoverLetterMutation, useExtractJobInfoMutation } from '../../redux/userApiSlice';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import AddCompany from '../AddCompany'; // Import the AddCompany component

const CoverLetterGeneration = ({ resume, jd, pdfText }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractingJobInfo, setExtractingJobInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobInfo, setJobInfo] = useState({});
  
  const [generateCoverLetter] = useGenerateCoverLetterMutation();
  const [extractJobInfo] = useExtractJobInfoMutation();
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

  // Add new handler for opening the job application modal
  const handleOpenApplicationModal = async () => {
    if (!jd) {
      toast.error('Job description is required');
      return;
    }

    setExtractingJobInfo(true);
    try {
      const response = await extractJobInfo({ jobDescription: jd }).unwrap();
      setJobInfo(response);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to extract job information:', error);
      toast.error('Failed to extract job details, please fill them manually');
      // Open modal with empty data even if extraction fails
      setJobInfo({});
      setIsModalOpen(true);
    } finally {
      setExtractingJobInfo(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!coverLetter) {
      toast.error('No cover letter to download');
      return;
    }
    
    try {
      // Create a temporary div with proper styling
      const tempDiv = document.createElement('div');
      tempDiv.className = 'p-6 max-w-none bg-white text-black';
      tempDiv.innerHTML = markdownRef.current.innerHTML;
      tempDiv.style.fontSize = '12pt'; // PDF points
      
      // Apply styles directly to paragraph elements
      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach(p => {
        p.style.marginBottom = '16pt';
      });
      
      // Apply styles to headings
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(h => {
        h.style.marginTop = '20pt';
        h.style.marginBottom = '12pt';
      });
      
      // Make strong elements actually bold
      const boldElements = tempDiv.querySelectorAll('strong');
      boldElements.forEach(el => {
        el.style.fontWeight = '700';
      });
      
      document.body.appendChild(tempDiv);
      
      // Configure PDF options
      const opt = {
        margin: [20, 20, 20, 20], // [top, left, bottom, right]
        filename: 'cover-letter.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all'] }
      };
      
      // Generate PDF
      await html2pdf().from(tempDiv).set(opt).save();
      
      // Clean up
      document.body.removeChild(tempDiv);
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
          style={{ wordWrap: 'break-word' }}
          >
            <style>
              {`
              .markdown-content p {
                margin-bottom: 1em;
              }
              .markdown-content h1, 
              .markdown-content h2, 
              .markdown-content h3, 
              .markdown-content h4 {
                margin-top: 1em;
                margin-bottom: 1em;
              }
              .markdown-content strong {
                font-weight: 700;
              }
              `}
            </style>
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
          
          {/* New Apply Now button */}
          <motion.button
            onClick={handleOpenApplicationModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            disabled={extractingJobInfo}
            className='flex-1 p-3 bg-green-600/80 text-white rounded-lg
                      font-medium shadow-lg shadow-green-500/20 flex items-center justify-center
                      space-x-2 hover:bg-green-700/80 hover:shadow-xl hover:shadow-green-500/30
                      transition-all duration-300'
          >
            <FiPlus className="w-5 h-5" />
            <span>{extractingJobInfo ? 'Analyzing...' : 'Add to Application'}</span>
          </motion.button>
        </motion.div>
      )}
      
      {/* Use the updated AddCompany component */}
      <AddCompany 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={jobInfo} 
        hideButton={true}
      />
    </motion.div>
  );
};

export default CoverLetterGeneration;