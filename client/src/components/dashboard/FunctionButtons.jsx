import React from 'react'
import { IoMdSearch, IoMdRefresh } from 'react-icons/io';
import { Switch } from '@headlessui/react'


const FunctionButtons = ({isReverse, setIsReverse, isOpen, setIsOpen, searchInput, setSearchInput, setStatusFilter}) => {
    const handleReverse = () => {
        setIsReverse(!isReverse);
      }
    
      const handleClick = () => {
        isOpen ? setIsOpen(false) : setIsOpen(true)
      }
    
      const handleSearchClick = (e) => {
        e.stopPropagation();
      }
    
      const handleSubmit = () => {
        setIsOpen(false);
      }
    
      const handleRefresh = () => {
        setSearchInput('');
        setStatusFilter('All');
      }
    
  return (
    <>
        <div className='flex flex-row items-center'>
            <div className='btn flex items-center justify-center bg-transparent rounded-full w-8 h-8 hover:bg-gray-200 hover:bg-opacity-20' onClick={handleClick}>
                <IoMdSearch className='text-2xl label'/>
            </div>

            <div>
              <button
                  className='btn flex items-center justify-center bg-transparent rounded-full w-8 h-8 hover:bg-gray-200 hover:bg-opacity-20'
                  onClick={handleRefresh}
              >
                  <IoMdRefresh className='text-2xl'/>
              </button>
            </div>

            <div className='flex flex-row items-center ml-2'>
              <Switch 
                checked={isReverse}
                onChange={handleReverse}
                className='group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center bg-gray-200 bg-opacity-60 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
                <span className="sr-only">Reverse</span>
                <span
                  className={`${
                    isReverse ? 'translate-x-4 bg-blue-300' : 'translate-x-0 bg-white'
                  } pointer-events-none inline-block h-4 w-4 rounded-full  shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
              <label as="span" className="label text-sm cursor-pointer ml-2">
                <span className="text-gray-200">Reverse</span>
              </label>
            </div>
        </div>



    {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50"
        onClick={handleClick}>
        
            <div className="relative flex flex-row top-[20%] justify-center" onClick={handleSearchClick}>
                <label className="w-60 md:w-64 lg:w-72 xl:w-80 h-12 items-center justify-center">
                  <input type="text" className="input grow mt-2.5 text-gray-50 placeholder-gray-200" placeholder="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
                </label>
                <button className="btn bg-transparent hover:bg-gray-200 hover:bg-opacity-20 flex justify-center items-center w-12 h-12 mt-1.5 rounded-full" onClick={handleSubmit}>
                  <IoMdSearch className="label text-3xl text-gray-200"/>
                </button>
              </div>
        </div>

    )}
    </>

  )
}

export default FunctionButtons
