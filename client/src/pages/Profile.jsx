import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import PersonalInfo from '../components/profile/PersonalInfo'
import { useGetProfileQuery } from '../redux/userApiSlice'
import Page404 from './Page404'
import Stats from '../components/profile/Stats'

const Profile = () => {
  const { userInfo } = useSelector((state) => state.authReducer)
  console.log(userInfo)
  const { id }= useParams();
  const profileId = id || userInfo?._id;
  const { data: profileUser, isLoading, error } = useGetProfileQuery(profileId);

  if (!profileUser){
    return <Page404 />
  };
  const isCurrentUser = userInfo?._id === profileId; 
  return (
    <div className='screen'>
      <Navbar />
      <div className='relative w-[80%] left-1/2 -translate-x-1/2 md:mt-8 sm:mt-5 label-text font-bold md:text-3xl sm:text-2xl'>Profile</div>
      <div className='relative left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row justify-between items-center mt-4 backdrop-blur-md bg-gray-200/40 dark:bg-black/40 w-[80%] rounded-xl mb-3'>
        <Stats user={profileUser} isCurrentUser={isCurrentUser}/>
        <PersonalInfo isCurrentUser={isCurrentUser} user={profileUser}/>
      </div>
    </div>
  )
}

export default Profile