import { motion } from "framer-motion";
import React from "react";
import { useGetCompanyByUserIdQuery } from "../../redux/companyApiSlice";
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

  const { data: companies, isLoading }= useGetCompanyByUserIdQuery(user._id, {
    skip: !user._id
  });

  console.log(companies);

  const statsData = [
    { label: "OA", value: companies?.filter((company) => company.status === "OA").length },
    { label: "Interview", value: companies?.filter((company) => company.status === "Interview1" ).length + companies?.filter((company) => company.status === "Interview2" ).length + companies?.filter((company) => company.status === "Interview3" ).length },
    { label: "Rejected", value: companies?.filter((company) => company.status === "Rejected").length },
  ];


  const validCompanies = user.applications.length;
  console.log(validCompanies);

  return (
    <motion.div
      className="h-full w-full md:w-1/2 rounded-md flex flex-col items-center justify-center md:justify-between"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img
        src={user.profilePic}
        alt=""
        className="h-20 md:h-32 w-20 md:w-32 mt-12 md:mt-0 rounded-full mb-4"
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
            <div className="text-md md:text-lg prime-text">
              Hi, <span className="font-bold text-blue-600 dark:text-blue-400">{user.username}</span>!
            </div>
            <div className="text-md md:text-md prime-text">
              You have made <span className="text-blue-600 font-bold dark:text-blue-400">{validCompanies}</span> applications
            </div>
          </>
        ) : (
          <div className="text-md md:text-lg prime-text">
            {user.username} has applied to {validCompanies} companies
          </div>
        )}
      </motion.div>

      <motion.div variants={containerVariants} className="mb-16 md:mb-0">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="grid grid-cols-2 space-x-4 mb-1 md:mb-0"
            variants={itemVariants}
          >
            <div className="text-md md:text-lg prime-text">{stat.label}</div>
            <div className="text-md md:text-lg text-blue-500">
              {stat.value} <span className="text-md md:text-lg prime-text">/ {validCompanies}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Stats;