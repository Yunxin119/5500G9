import { MdEdit } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/authReducer';
import { useGetProfileQuery, useUpdateProfileMutation, useSendVerificationEmailMutation } from '../../redux/userApiSlice';
import { toast } from 'react-toastify';
import { setCredential } from '../../redux/authReducer';
import { motion } from 'framer-motion';

export default function PersonalInfo({ isCurrentUser, user }) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.authReducer.userInfo);
    const { data: profileUser, refetch } = useGetProfileQuery(user._id);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [sendVerificationEmail] = useSendVerificationEmailMutation();
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState(user.gender);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editProfile, setEditProfile] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [showEmailVerified, setShowEmailVerified] = useState(isCurrentUser && profileUser?.isVerified);

    useEffect(() => {
        refetch();
        setShowEmailVerified(isCurrentUser && profileUser?.isVerified);
    }, []);

    const handleEditProfile = async () => {
        if (!editProfile) {
        setEditProfile(true);
        } else {
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const res = await updateProfile({ id: user._id, username, email, password, confirmPassword, gender }).unwrap();
            toast.success('Profile updated');
            setEditProfile(false);
            if (isCurrentUser) {
            dispatch(setCredential(res));
            } else {
            dispatch(updateUser(res));
            }
        } catch (error) {
            toast.error('Failed to update profile');
            console.error('Error updating profile:', error);
        }
        }
    };

    // Animation variants
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

    return (
        <motion.div
        className="w-full md:w-[60%] shadow sm:rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        <div className="px-4 py-6 sm:px-6">
            <div className="flex flex-row items-center justify-between">
            <motion.h3 
                className="text-base font-semibold prime-text"
                variants={itemVariants}
            >
                User Information
            </motion.h3>
            {isCurrentUser && (
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className={`rounded-md text-sm ${
                    !editProfile ? "text-blue-500 hover:text-blue-400" : "text-gray-500 hover:text-gray-400"
                }`}
                onClick={handleEditProfile}
                >
                {editProfile ? <FaCheck /> : <MdEdit />}
                </motion.button>
            )}
            </div>
            <motion.p 
            className="mt-1 max-w-2xl text-sm/6 sec-text"
            className="mt-1 max-w-2xl text-sm/6 text-gray-500"
            variants={itemVariants}
            >
            Personal details and application stats.
            </motion.p>
        </div>
        <div className="border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
            <motion.div 
                className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-6"
                variants={itemVariants}
            >
                <dt className="text-sm font-medium prime-text">Username</dt>
                <dd className="mt-1 text-sm sec-text sm:col-span-2">
                {editProfile ? (
                    <input
                    className="form-control profile-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                ) : (
                    user.username
                )}
                </dd>
            </motion.div>

            {isCurrentUser && (
                <motion.div 
                className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-6"
                variants={itemVariants}
                >
                <dt className="text-sm font-medium prime-text">Email address</dt>
                <dd className="mt-1 text-sm sec-text sm:col-span-2">
                    {user.email}
                </dd>
                </motion.div>
            )}

            <motion.div 
                className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-6"
                variants={itemVariants}
            >
                <dt className="text-sm font-medium prime-text">Gender</dt>
                <dd className="mt-1 text-sm sec-text sm:col-span-2">
                {editProfile ? (
                    <select
                    className="form-control profile-input"
                    value={gender}
                    onChange={(e) => {
                        setGender(e.target.value);
                        console.log(e.target.value);
                    }}
                    >
                    <option value="female">female</option>
                    <option value="male">male</option>
                    <option value="other">Do not wish to answer</option>
                    </select>
                ) : (
                    user.gender
                )}
                </dd>
            </motion.div>

            {isCurrentUser && (
                <motion.div 
                className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-6"
                variants={itemVariants}
                >
                <dt className="text-sm font-medium prime-text">Password</dt>
                <dd className="mt-1 text-sm sec-text sm:col-span-2 flex">
                    {editProfile ? (
                    <div className='flex flex-col gap-2'>
                        <input
                        className="form-control profile-input border-[1px] border-white"
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                        className="form-control profile-input border-[1px] border-white"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    ) : (
                    '**********'
                    )}
                </dd>
                </motion.div>
            )}

            <motion.div 
                className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-6"
                variants={itemVariants}
            >
                <dt className="text-sm font-medium prime-text">About</dt>
                <dd className="mt-1 text-sm sec-text sm:col-span-2">
                {user.about || 'No information provided'}
                </dd>
            </motion.div>
            </dl>
        </div>
        </motion.div>
    );
}