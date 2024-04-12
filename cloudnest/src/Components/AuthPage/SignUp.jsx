import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../../firebase'; // assuming you have providers for Google and Facebook
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { facebooklogin } from "../../assets";

function SignUp({ switchToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  //fix function to collect username and store and look for a method to sign in with username
  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("user signed up: ", userCredential.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleGoogleSignUp = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("user signed up with Google: ", result.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleFacebookSignUp = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        console.log("user signed up with Facebook: ", result.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="auth-form">
      <h4 className="font-poppins font-bold text-[28px] leading-[32px] text-custom-blue mb-5 ">Register Now</h4>
      <form onSubmit={handleSignUp}>
      <div className="input-group">
          <PersonIcon style={{ color: '#02386E' }} />
          <input className='inputs' type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <EmailIcon style={{ color: '#02386E' }} />
          <input className='inputs' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <LockIcon style={{ color: '#02386E' }} />
          <input className='inputs' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
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
    <img src={facebooklogin} class="h-6 w-6 mr-2" />
    <span>Create account with Facebook</span>
</button>
      </div >
      </form>
      <span className="text-white ml-6">Already have an account? </span><button className='text-third font-bold' onClick={switchToSignIn}>Sign In </button>
    </div>
  );
}

export default SignUp;
