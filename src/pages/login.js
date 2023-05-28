import { Link, useNavigate } from "react-router-dom"
import firebaseContext from '../context/firebase'
import { useState, useContext, useEffect } from "react"
import * as ROUTES from "../constants/routes"
// import { signInWithEmailAndPassword } from 'firebase/auth';

//working on history error

export default function Login(){
   const navigate = useNavigate();
   const { firebase } = useContext(firebaseContext);

   const [emailAddress, setEmailAddress] = useState('');
   const [password, setPassword] = useState('');

   const [error, setError] = useState('');
   const isInvalid = password === '' || emailAddress === ''

   const handleLogin = async (event) => {
      event.preventDefault();
      try {
         await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
         navigate(ROUTES.DASHBOARD);
      } catch (error) {
         setEmailAddress('');
         setPassword('');
         setError(error.message)
      }
   }

   useEffect(()=>{
      document.title = 'Login - Instaclone'
   }, [])


   return(
   <div className="container flex mx-auto max-w-screen-md items-center h-screen" >
      <div className="flex w-2/4">
         <img src="/images/iphone-with-profile.jpg" alt=""/>
      </div>
      <div className="flex flex-col w-2/4">
      <div>
         <h1 className="flex justify-center w-full italic text-3xl mb-3">Instaclone</h1>
         {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

         <form onSubmit={handleLogin} method="POST">
            <input 
             aria-label="Enter your email address"
             type="text"
             placeholder="Email address"
             className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
              border-gray-primary rounded mb-2"
              onChange={({target}) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input 
             aria-label="Enter your password"
             type="password"
             placeholder="Password"
             className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
              border-gray-primary rounded mb-2"
              onChange={({target}) => setPassword(target.value)}
              value={password}
            />
            <button 
            disabled={isInvalid}
            type="submit"
            className={`bg-blue-medium w-full rounded h-8 font-bold text-white
             ${isInvalid && 'opacity-50'}`}
            >Log In
            </button>
         </form>
         </div>
         <div className="flex justify-center items-center mt-2 flex-col w-full bg-white p-4">
         <p className="text-sm">Don't have an account?{' '}
         <Link to={ROUTES.SIGN_UP} className="onnt-bold text-blue-medium">
            Sign up
         </Link>
         </p>
        </div>
      </div>
      
   </div>
   )  
}