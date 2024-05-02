import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { facebooklogin } from "../../assets";
import {useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import "./authCss.css"
function SignIn({ switchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("user logged : ", userCredential.user)
        console.log("username ", auth.currentUser.displayName);
        const user = userCredential.user;
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/profile');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("user logged with Google: ", result.user);
        const user = result.user;
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/profile');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        console.log("user logged with Facebook: ", result.user);
        const user = result.user;
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/profile');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="auth-form">
      <h4 className="font-poppins font-bold text-[28px] leading-[32px] text-custom-blue mb-5 ">Login Now</h4>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSignIn}>
        <div className="input-group">
          <EmailIcon style={{ color: '#02386E' }}/>
          <input
            className='inputs'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <LockIcon style={{ color: '#02386E' }} />
          <input
            className='inputs'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="rounded-full bg-third hover:bg-secondary text-white font-semibold py-1 px-4 shadow-lg ml-44 mb-3">
  Sign In
</button>
      </form>
      <div className="ml-1">
      <div className='mb-2'>
    <button class="social-b" onClick={handleGoogleSignIn}>
        <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
        <span>Login with Google</span>
    </button>
</div>
<button class="social-b mb-2" onClick={handleFacebookSignIn}>
    <img src={facebooklogin} alt='facebookIcon' class="h-6 w-6 mr-2" />
    <span>Login with Facebook</span>
</button>
      </div >
      <span className="text-white">Don't have an account yet? </span><button className='text-third font-bold' onClick={switchToSignUp}>Register </button>
    </div>
  );
}

export default SignIn;
