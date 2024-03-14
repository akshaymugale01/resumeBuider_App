import React, { Suspense } from 'react'; 
import { Header, MainSpinner } from "../components";
import { Route, Routes } from 'react-router-dom';
import  HomeContainer  from "../containers/HomeContainer";
import CreateTemplate from './CreateTemplate';
import Createresume from './Createresume';
import UserProfile from './UserProfile';
import TempleteDesignPinDetails from './TemplateDesignPinDetails';

const Homescreen = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <Header />
      <main className='w-full'>
        <Suspense fallback={<MainSpinner />}> 
          <Routes>
            <Route path='/' element={<HomeContainer />}/>
            <Route path="/templete/create" element={<CreateTemplate />} /> 
            <Route path='/profile/:uid' element={<UserProfile />} />
            <Route path='/resume/*' element={<Createresume />}/>
            <Route 
             path='/resumeDetail/:templateID'
             element={<TempleteDesignPinDetails />} 
             />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default Homescreen;
