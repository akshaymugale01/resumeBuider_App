import React, { useState } from 'react';
import useUser from '../hooks/useUser';
import logo from "../assets/resumeL.png"
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DotLoader } from 'react-spinners';

import { HiLogout } from "react-icons/hi"
import { auth } from '../config/firebaseConfig';
import { useQueryClient } from 'react-query';
import { adminIds } from '../utils/helper';
import useFilters from '../hooks/useFilters';


const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false)

  const queryClient = useQueryClient();

  const { data: filterData } = useFilters()

  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  const handleSearchTerm = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: e.target.value,
    });
  };

  const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  }
  
  return (
    <header className='w-full flex items-center justify-between px-5 py-3 lg:px-8 border-gray-300 bg-slate-400 z-50 gap-10 sticky top-0'>
      {/* logo */}
      <Link to={"/"}>
        <img src={logo} className='w-12 h-auto object-contain' alt="png" />
      </Link>
      {/* input */}
      <div className='flex-1 border border-gray-700 px-4 py-1 rounded-b-md flex items-center justify-between bg-gray-200'>
        <input
        value={filterData?.searchTerm ? filterData?.searchTerm : ""}
          onChange={handleSearchTerm}
          type="text"
          placeholder='Search h...'
          className='flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none' />
      
      <AnimatePresence>
  {filterData?.searchTerm.length > 0 && (
    <motion.div 
      onClick={clearFilter}
      initial={{ opacity: 0, scale: .7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      className='w-8 h-8 flex items-center justify-center bg-gray-400 rounded-md cursor-pointer active:scale-95 duration-150'>
      <p className='text-2xl text-black'>x</p>
    </motion.div>
  )}
</AnimatePresence>

      </div>


      {/* profile section */}
      <AnimatePresence>
        {isLoading ? (
          <DotLoader color='#498FCD' size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='relative'
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className='w-10 h-10 rounded-md relative flex items-center justify-center cursor-pointer'>
                    <img src={data?.photoURL} className='w-full h-full object-cover rounded-md' referrerPolicy='no-referrer' alt="" />
                  </div>
                ) : (
                  <div className='w-10 h-10 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md'>
                    <p className='text-lg text-white'>{data?.email[0]}</p>
                  </div>
                )}

                {/* dropdownmenu */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      // {...slideUpMenu}
                      initial={{ opacity: 0, scale: .7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: .7 }}
                      className='absolute px-4 py-3 rounded-md bg-yellow-100 right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12'
                      onMouseLeave={() => setIsMenu(false)}>
                      {data?.photoURL ? (
                        <div className='w-20 h-20 rounded-full relative flex flex-col items-center justify-center cursor-pointer'>
                          <img src={data?.photoURL} className='w-full h-full object-cover rounded-full' referrerPolicy='no-referrer' alt="" />

                        </div>
                      ) : (
                        <div className='w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer'>
                          <p className='text-3xl text-white'>{data?.email[0]}</p>
                        </div>
                      )}

                      {data?.displayName && (
                        <p className='text-lg text-gray-500'>{data?.displayName}</p>
                      )}

                      {/* Menu */}
                      <div className='w-full flex-col items-start flex gap-8 pt-6'>

                        <Link className='text-gray-500 hover:text-green-500  text-base whitespace-nowrap' to={`/profile/${data?.uid}`}> My Account </Link>

                        {
                          adminIds.includes(data?.uid) && (
                            <Link className='text-gray-500 hover:text-green-500 text-base whitespace-nowrap' to={"/templete/create"}> Add New!
                            </Link>
                          )
                        }

                        <div className='w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group '
                          onClick={signOutUser}
                          npm >
                          <p className='group-hover:text-red-950 text-gray-500 cursor-pointer'>Sign Out!</p>
                          <HiLogout className='group-hover:text-gray-500 text-gray-100 cursor-pointer' />
                        </div>

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>
              </motion.div>

            ) : (
              <Link to={"/auth"}>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}

                  className='px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150' type='button'
                >LogIN</motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>

  )
};
export default Header
