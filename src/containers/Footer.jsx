import React from 'react';
import logo from "../assets/resumeL.png"
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='w-full flex items-center justify-between border-t border-gray-300'>
        <div className='flex items-center justify-center gap-2'><img src={ logo } className='w-12 h-auto object-contain' alt="png" />
        <p>BuildResume!</p>
        </div>
        <div className='flex items-center justify-center gap-6'>
            <Link to={"/"} className='text-blue-700 text-lg'>Home</Link>
            <Link to={"/"} className='text-blue-700 text-lg'>Contact</Link>
            <Link to={"/"} className='text-blue-700 text-lg'>Hello</Link>
        </div>
    </div>
  )
}

export default Footer
