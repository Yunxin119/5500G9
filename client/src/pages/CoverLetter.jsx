import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { useState } from 'react'
import InfoInput from '../components/coverletter/InfoInput'
import CoverLetterGeneration from '../components/coverletter/CoverLetterGeneration'
import userApiSlice from '../redux/userApiSlice'

const CoverLetter = ({ currentUser }) => {
    const [resume, setResume] = useState(currentUser.resume || '');
    const [jd, setJd] = useState('');
    const [pdfText, setPdfText] = useState('');

  return (
    <div className='screen'>
        <Navbar />
        <motion.div className='mt-8 relative left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row justify-between items-center mt-4 backdrop-blur-md bg-gray-200/40 dark:bg-black/40 w-[80%] rounded-xl mb-3'>
            <InfoInput 
              setResume={setResume} 
              setJd={setJd} 
              setPdfText={setPdfText} 
            />
            <CoverLetterGeneration 
              resume={resume} 
              jd={jd} 
              pdfText={pdfText} 
            />
        </motion.div>
    </div>
  )
}

export default CoverLetter