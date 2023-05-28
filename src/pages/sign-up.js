import { Link, useNavigate } from "react-router-dom"
import firebaseContext from '../context/firebase'
import { useState, useContext, useEffect } from "react"
import * as ROUTES from "../constants/routes"
import { doesUsernameExist } from "../services/firebase"


export default function Signup(){
   const navigate = useNavigate();
   const { firebase } = useContext(firebaseContext);

   const [emailAddress, setEmailAddress] = useState('');
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [fullName, setFullName] = useState('');

   const [error, setError] = useState('');
   const isInvalid = password === '' || emailAddress === ''

   const handleSignup = async (event) => {
      event.preventDefault();

      const usernameExists = await doesUsernameExist(username)
      if (!usernameExists) {
         try {
           const createdUserResult = await firebase
             .auth()
             .createUserWithEmailAndPassword(emailAddress, password);
   
           // authentication
           // -> emailAddress & password & username (displayName)
           await createdUserResult.user.updateProfile({
             displayName: username
           });
   
           // firebase user collection (create a document)
           await firebase
             .firestore()
             .collection('users')
             .add({
               userId: createdUserResult.user.uid,
               username: username.toLowerCase(),
               fullName,
               emailAddress: emailAddress.toLowerCase(),
               following: [],
               followers: [],
               dateCreated: Date.now()
             });
   
             navigate(ROUTES.DASHBOARD);
         } catch (error) {
           setFullName('');
           setEmailAddress('');
           setPassword('');
           setError(error.message);
         }
       } else {
         setUsername('');
         setError('That username is already taken, please try another.');
       }
   };
   

   useEffect(()=>{
      document.title = 'Signup - Instaclone'
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

         <form onSubmit={handleSignup} method="POST">
            <input 
             aria-label="Enter your fullname"
             type="text"
             placeholder="Fullname"
             className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
              border-gray-primary rounded mb-2"
              onChange={({target}) => setFullName(target.value)}
              value={fullName}
            />
            <input 
             aria-label="Enter your username"
             type="text"
             placeholder="Username"
             className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
              border-gray-primary rounded mb-2"
              onChange={({target}) => setUsername(target.value)}
              value={username}
            />
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
            >Sign Up
            </button>
         </form>
         </div>
         <div className="flex justify-center items-center mt-2 flex-col w-full bg-white p-4">
         <p className="text-sm">Have an account?{' '}
         <Link to={ROUTES.LOGIN} className="onnt-bold text-blue-medium">
            Log in
         </Link>
         </p>
        </div>
      </div>
      
   </div>
   )  
}