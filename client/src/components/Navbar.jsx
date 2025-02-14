import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FaBars, FaXmark, FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authReducer';
import { toast } from 'react-toastify';
// import AddCompany from './AddCompany';

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.authReducer)
    const dispatch = useDispatch();
    const handleSignOut = () => {
      dispatch(logout())
      toast.success('You have been signed out')
    }
    return (
        <Disclosure as="nav" className="bg-gray-100  bg-opacity-10 shadow">
          <div className="mx-auto w-screen px-8">
            <div className="flex h-[7vh] justify-between">
              <div className="flex">
                <div className="mr-2 flex items-center">
                </div>
                <div className="flex shrink-0 items-center">
                  <Link to="/" className="text-2xl h-8 font-bold text-gray-200">JobHunter.</Link>
                </div>
                <div className="flex md:space-x-8 md:ml-6 sm:space-x-5 sm:ml-3">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-200 hover:border-gray-300 hover:text-gray-700"
                  >
                    Applications
                  </Link>
                  <Link
                    href="/calendar"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-200 hover:border-gray-300 hover:text-gray-700"
                  >
                    Cover Letters
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                {/* { userInfo && <AddCompany />} */}
                <div className="ml-4 flex items-center">
                    { userInfo ? (
                    <Menu as="div" className="relative ml-3">
                        <div>
                            <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                                alt=""
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="h-8 w-8 rounded-full"
                            />
                            </MenuButton>
                        </div>
                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <MenuItem>
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                            >
                                Profile
                            </Link>
                            </MenuItem>
                            <MenuItem>
                            <div 
                            onClick = {handleSignOut}
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                                Sign Out
                            </div>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                    ) : (
                        <Link to='/login' className="rounded-full bg-transparent px-4 py-2 text-md font-semibold text-white shadow-sm hover:bg-gray-600 hover:bg-opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Sign In
                        </Link>
                    )}
                </div>
              </div>
            </div>
          </div>
        </Disclosure>
      )
}

export default Navbar
