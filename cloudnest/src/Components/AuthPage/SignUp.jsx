import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider, firestore } from '../../firebase'; 
import {FacebookAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import {setDoc,doc, addDoc, query, where, collection, getDocs } from "firebase/firestore"; 
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { facebooklogin } from "../../assets";
import Snackbar from '../Snackbar/Snackbar';

function SignUp({ switchToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showSnackbar,setShowSnackbar] = useState(false);
  const toDisplay = "User Registered Sucessfully";
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setError('Username is already taken');
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: username });

      const user = userCredential.user;
      const docRef = await setDoc(doc(firestore, "users", user.uid), {
        username: username,
        email: email,
        provider: "email/password",
      });
      setUsername('');
      setEmail('');
      setPassword('');
      setShowSnackbar(true);
      console.log("Document written with ID: ", user.uid);
      console.log("User signed up:", user);
      console.log("Username:", auth.currentUser.displayName);
    } catch (error) {
      if (error.message.includes('Firebase: Password should be at least 6 characters (auth/weak-password).')) {
        setError("Password is weak")
        console.log(error.message)

      }
      if (error.message.includes('Firebase: Error (auth/invalid-email).')) {
        setError("Email format is incorrect")
        console.log(error.message)
      }
    }
  };
  
  const checkUsernameExists = async (username) => {
    const q = query(collection(firestore, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };
  const checkinExistingMail = async (email) => {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };
  
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      const existingUser = await checkinExistingMail(email);
      if (existingUser) {
        throw new Error("User already exists");
      }
      const usernameToSet = suggestedUsername(result.user);
      await updateProfile(auth.currentUser, { displayName: usernameToSet });
      const user = result.user;
      const docRef =  await setDoc(doc(firestore, "users", user.uid), {
        username: usernameToSet,
        email: email,
        provider: "google",
      });
      
      setShowSnackbar(true);
      console.log("Document written with ID: ", docRef.id);
      console.log("Username:", usernameToSet);
    } catch (error) {
      setError(error.message);
      
    }
  };
  const handleFacebookSignUp = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Wait for the user's information to be available
      await updateProfile(user, { displayName: user.displayName });
  
      // Check if the user has a valid email before proceeding
      if (!user.email || !isValidEmail(user.email)) {
        throw new Error("Invalid email format or email not provided");
      }
  
      const usernameToSet = suggestedUsername(user);
      await setDoc(doc(firestore, "users", user.uid), {
        username: usernameToSet,
        email: user.email,
        provider: "facebook",
      });
      setShowSnackbar(true);
      console.log('User Registered Successfully!!', user);
      console.log('User email:', user.email);
    } catch (error) {
      setError(error.message);
    }
  };
  

  const isValidEmail = (email) => {
    // Simple email format validation (can be improved based on your requirements)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const suggestedUsername = (user) => {
    const provider = user.providerData[0].providerId;
    const providerName = provider === 'google.com' ? 'Google' : 'Facebook';
    return `${providerName}_${user.displayName.replace(/\s+/g, '')}`;
  };
  

  return (
    <div className="auth-form">
      {showSnackbar && <Snackbar showSnackbar={showSnackbar} setShowSnackbar={setShowSnackbar} toDisplay={toDisplay}/>}
      <h4 className="font-poppins font-bold text-[28px] leading-[32px] text-custom-blue mb-5 ">Register Now</h4>
      <form onSubmit={handleSignUp}>
        <div className="input-group">
          <PersonIcon style={{ color: '#02386E' }} />
          <input className='inputs' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <EmailIcon style={{ color: '#02386E' }} />
          <input className='inputs' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <LockIcon style={{ color: '#02386E' }} />
          <input className='inputs' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="rounded-full bg-third hover:bg-secondary text-white font-semibold py-1 px-4 shadow-lg ml-48 mb-3">
          Sign Up
        </button>
        <div className="ml-1">
          <div className='mb-2'>
            <button class="social-b" onClick={handleGoogleSignUp}>
              <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
              <span>Create account with Google</span>
            </button>
          </div>
          <button class="social-b mb-2" onClick={handleFacebookSignUp}>
            <img src={facebooklogin} alt='facebookIcon' class="h-6 w-6 mr-2" />
            <span>Create account with Facebook</span>
          </button>
        </div>
      </form>
      
   

      <span className="text-white ml-6">Already have an account? </span><button className='text-third font-bold' onClick={switchToSignIn}>Sign In </button>
    </div>
  );
}

export default SignUp;
