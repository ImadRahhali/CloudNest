import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../../firebase'; // assuming you have providers for Google and Facebook
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
function SignUp({ switchToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="input-group">
          <EmailIcon />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <LockIcon />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Sign Up</button>
        <button type="button" onClick={handleGoogleSignUp}>
          <GoogleIcon /> Sign Up with Google
        </button>
        <button type="button" onClick={handleFacebookSignUp}>
          <FacebookIcon /> Sign Up with Facebook
        </button>
      </form>
      <button onClick={switchToSignIn}>Already have an account? Sign In</button>
    </div>
  );
}

export default SignUp;
