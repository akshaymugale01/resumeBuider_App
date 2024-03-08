import React from 'react'
import { FaChevronRight } from 'react-icons/fa';
import { GoogleAuthProvider, GithubAuthProvider, signInWithRedirect} from "firebase/auth";

import { auth } from "../config/firebaseConfig";

const AuthButton = ({ Icon, label, provider }) => {

    const googleLogin = new GoogleAuthProvider()
    const GitLogin = new GithubAuthProvider()

    //Phone Authentication
    

    const handleClick = async () => {
        switch (provider) {
            case "GoogleAuthProvider":
                await signInWithRedirect(auth, googleLogin).then((result) => {
                    console.log(result)
                })
                    .catch(err => {
                        console.log(`Error: ${err.message}`);
                    });
                break;
            case "GithubAuthProvider":
                await signInWithRedirect(auth, GitLogin).then((result) => {
                    console.log(result)
                })
                    .catch(err => {
                        console.log(`Error: ${err.message}`);
                    });
                break;

            default:
                await signInWithRedirect(auth, googleLogin).then((result) => {
                    console.log(result)
                })
                    .catch(err => {
                        console.log(`Error: ${err.message}`);
                    });
        }
    }

    return (
        <div onClick={handleClick} className='flex items-center w-full px-4 py-3 rounded-md border-2 border-gray-700 justify-between cursor-pointer group hover:bg-blue-400 active:scale-95 duration-150 hover:shadow-md'>
            <Icon className="text-textPrimary text-xl group-hover:text-white" />
            <p className='text-textPrimary text-lg group-hover:text-white'>{label}</p>
            <FaChevronRight className='text-textPrimary text-lg group-hover:text-white' />
        </div>
    )
}

export default AuthButton
