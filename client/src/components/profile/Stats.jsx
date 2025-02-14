import { motion } from "framer-motion";
import React from "react";
const Stats = ({ user, isCurrentUser }) => {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const statsData = [
    { label: "OA", value: 1 },
    { label: "Interview", value: 1 },
    { label: "Rejected", value: 2 },
    { label: "Offer", value: 0 }
  ];

  const validCompanies = 10;

  return (
    <motion.div
      className="h-full w-1/2 rounded-md flex flex-col items-center justify-between"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img
        src={user.profilePic}
        alt=""
        className="h-32 w-32 rounded-full mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div 
        className="flex flex-col items-center justify-center w-full"
        variants={itemVariants}
      >
        {isCurrentUser ? (
          <>
            <div className="text-md md:text-lg text-gray-200">
              Hi, <span className="font-bold text-blue-600 dark:text-blue-400">{user.username}</span>!
            </div>
            <div className="text-md md:text-md text-gray-200">
              You have made <span className="text-blue-600 font-bold dark:text-blue-400">{validCompanies}</span> applications
            </div>
          </>
        ) : (
          <div className="text-md md:text-lg text-gray-200">
            {user.username} has applied to {validCompanies} companies
          </div>
        )}
      </motion.div>

      <motion.div variants={containerVariants}>
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="grid grid-cols-2 space-x-4"
            variants={itemVariants}
          >
            <div className="text-md md:text-lg text-gray-200">{stat.label}</div>
            <div className="text-md md:text-lg sec-text">
              {stat.value} <span className="text-md md:text-lg text-gray-200">/ {validCompanies}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Stats;