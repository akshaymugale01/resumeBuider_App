import React, { useEffect } from 'react'
import logo from "../assets/resumeL.png"
import Footer from '../containers/Footer';

import AuthButton from '../components/AuthButton';
import { FaGoogle, FaGithub } from 'react-icons/fa';

import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { MainSpinner } from '../components';

const Authentication = () => {
  const { data, isLoading, isError } = useUser();

  const navigate = useNavigate();

  useEffect(()=> {
    if(!isLoading && data) {
      navigate("/", { replace : true });
    }
  }, [isLoading, data]);

  if(isLoading){
    return <MainSpinner />
  }
   
  return (
    <div className='auth-section'>
      {/* Top Section */}
      <img src={logo} className='w-12 h-auto object-contain' alt="png" />

      {/* Main Section */}
      <div className='w-full flex flex-1 flex-col items-center justify-center gap-5 bg-orange-200'>
        <h1 className='text-3xl lg:text-4xl text-red-400'>Welcome To Resumebuilder!</h1>
        <p className='text-base text-gray-600'>User Friendly Free Build Resume</p>
        <h2 className='text-2xl text-gray-600'>SignIn</h2>
        <div className='w-full lg:w-96 rounded-md flex flex-col items-center justify-center gap-5'>
          <AuthButton
            Icon={FaGoogle}
            label={"Sign In with Google"}
            provider={"GoogleAuthProvider"}
          />
          <AuthButton
            Icon={FaGithub}
            label={"Sign In with Github"}
            provider={"GithubAuthProvider"}
          />
        </div>
      </div>
    
      {/* footer section */}
      <Footer />
    </div>
  )
}

export default Authentication;