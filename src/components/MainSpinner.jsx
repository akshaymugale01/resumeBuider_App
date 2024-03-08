import React from 'react'
import { DotLoader, PuffLoader } from 'react-spinners'

const MainSpinner = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      {/* <PuffLoader color='#498FCD' size={80} /> */}
      <DotLoader color='#36d7b7' size={150}/>
    </div>
  )
}

export default MainSpinner;
