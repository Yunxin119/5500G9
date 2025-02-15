import React, { useState } from 'react';
import SingleCompany from './SingleCompany';
import { useSelector } from 'react-redux';
import { useGetCompanyQuery } from '../../redux/companyApiSlice';
import Filter from './Filter';
import FunctionButtons from './FunctionButtons';
import { motion, AnimatePresence } from 'framer-motion';

const CompanyGrid = () => {
  const { userInfo } = useSelector((state) => state.authReducer);
  const { data: companies } = useGetCompanyQuery();
  const [isReverse, setIsReverse] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');

  const validCompanies = Array.isArray(companies) ? companies : [];

  const filteredCompanies = validCompanies
    .slice()
    .sort((a, b) => {
      if (a.status === 'Rejected' && b.status !== 'Rejected') return 1;
      if (a.status !== 'Rejected' && b.status === 'Rejected') return -1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .filter(company => {
      if (statusFilter === 'All') return company.status !== 'Rejected';
      return company.status === statusFilter;
    })
    .filter(company => company.name.toLowerCase().includes(searchInput.toLowerCase()));

  const displayedCompanies = isReverse ? [...filteredCompanies].reverse() : filteredCompanies;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="container mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex flex-row justify-between items-center"
        variants={filterVariants}
      >
        {/* Filter Box */}
        <Filter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredCompanies={filteredCompanies}
        />
        {/* Functional Buttons */}
        <FunctionButtons
          isReverse={isReverse}
          setIsReverse={setIsReverse}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setStatusFilter={setStatusFilter}
        />
      </motion.div>

      <motion.div 
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-1 items-center"
        variants={gridVariants}
      >
        <AnimatePresence mode="wait">
          {displayedCompanies.length > 0 ? (
            displayedCompanies.map(company => (
              <motion.div
                key={company.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SingleCompany company={company} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-center text-gray-700 text-2xl col-span-full"
              variants={itemVariants}
            >
              No companies found
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CompanyGrid;