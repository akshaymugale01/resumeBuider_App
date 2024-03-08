
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { MdLayersClear } from "react-icons/md"
import { FliterAnimate } from '../animation';
import  { FilterData } from "../utils/helper"
import useFilters from '../hooks/useFilters';
import { useQueryClient } from 'react-query';



const Filter = () => {
  const [isClearHover, setIsClearHover] = useState(false);
  const{data: filterData, isLoading, isError} = useFilters();
    
  const queryclient = useQueryClient();

  const handleFilterValue = (value) => {
    // const previousState = queryclient.getQueryData("globalFilter");
    // const updatedState = {...previousState, searchTerm: value}
    // queryclient.setQueryData("globalFilter", updatedState)

    queryclient.setQueriesData("globalFilter", {
      ...queryclient.getQueryData("globalFilter"), 
    searchTerm : value,
  });
};

const clearFilter = () => {
  queryclient.setQueryData("globalFilter", {
    ...queryclient.getQueryData("globalFilter"),
    searchTerm: "",
  });
}

   return (
    <div className='w-full flex items-center justify-start py-4'> 
    <div className='border border-gray-300 rounded-md px-3 py-2 mr-2 
    cursor-pointer group hover:shadow-md bg-gray-200 relative '
    onMouseEnter={() => setIsClearHover(true)}
    onMouseLeave={() => setIsClearHover(false)}
    onClick={clearFilter}
    >
        <MdLayersClear className='text-xl' />
        <AnimatePresence>
         {isClearHover && (
           <motion.div 
            {...FliterAnimate}
           className='absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1'
           >
             <p className='whitespace-nowrap text-xs'>Clean all</p>
         </motion.div>
         )}
        </AnimatePresence>
    </div>
    <div className='w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none'>
  {FilterData && FilterData.map((item) => (
    <div
    onClick={()=> handleFilterValue(item.value)} 
    key={item.id} 
    className={`border border-red-200 rounded-md py-1 cursor-pointer group hover:shadow-md 
    ${filterData?.searchTerm === item.value && "bg-gray-300 shadow-md"}`}
    >
      <p className='text-sm text-gray-600 group-hover:text-gray-700 whitespace-nowrap'>{item.label}</p>
    </div>
  ))}
   </div>
    </div>
  )
}

export default Filter