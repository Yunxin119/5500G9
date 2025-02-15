import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authReducer';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaXmark } from "react-icons/fa6";
import { Menu } from '@headlessui/react';
import { useLogoutMutation } from '../redux/userApiSlice';
import AddCompany from './AddCompany';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutUser] = useLogoutMutation();

  const handleSignOut = async () => {
    try {
        const res = await logoutUser();
        dispatch(logout());
        navigate('/');
        toast.success('You have been signed out');
        setIsOpen(false);
    } catch (error) {
        toast.error('Failed to sign out, please try again');
    }
  };

  return (
    <nav className="bg-gray-100 bg-opacity-10 shadow z-50">
      <div className="mx-auto w-screen px-8">
        <div className="flex h-[7vh] justify-between">
          <div className="flex">
            <div className="mr-2 flex items-center">
            </div>
            <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="flex shrink-0 items-center">
              <Link to="/" className="text-2xl h-8 font-bold text-gray-200">JobHunter.</Link>
            </motion.div>
            <div className="hidden md:flex md:space-x-8 md:ml-6">
              <Link
                to="/cover-letter"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-200 hover:border-gray-300 hover:text-gray-700"
              >
                Cover Letter Generator
              </Link>
              <Link
                to="/applications"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-200 hover:border-gray-300 hover:text-gray-700"
              >
                My Applications
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {userInfo && <div className="hidden md:block"><AddCompany /></div>}
            <div className={`ml-4 flex items-center ${userInfo ? "hidden md:block": ""}`}>
              {userInfo ? (
                <Menu as="div" className="relative ml-3">
                  <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={userInfo?.profilePic}
                      className="h-8 w-8 rounded-full"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    </Menu.Item>
                    {userInfo.role === "admin" && (
                      <Menu.Item>
                        <Link
                          to="/users"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Users
                        </Link>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <button
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link to="/login" className="rounded-full bg-transparent px-4 py-2 text-md font-semibold text-white shadow-sm hover:bg-gray-600 hover:bg-opacity-30">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden ml-2 p-2 text-gray-200 hover:bg-gray-700 hover:text-white rounded-md"
            >
              {isOpen ? <FaXmark className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed left-0 right-0 top-[7vh] bg-gray-300/30 shadow-lg z-50 backdrop-blur-lg"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              <Link
                to="/cover-letter"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Cover Letter Generator
              </Link>
              <Link
                to="/applications"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                My Applications
              </Link>
            </div>

            {userInfo && (
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img className="h-8 w-8 rounded-full" src={userInfo.profilePic} alt="" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-200">{userInfo.name}</div>
                    <div className="text-sm font-medium text-gray-300">{userInfo.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {/* AddCompany placeholder */}
                  <div className="px-3 py-2">
                    <AddCompany />
                  </div>
                  <Link
                    to="/profile"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  {userInfo.role === "admin" && (
                    <Link
                      to="/users"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Manage Users
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;