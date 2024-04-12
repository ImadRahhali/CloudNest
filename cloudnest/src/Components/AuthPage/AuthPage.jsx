import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import styles from "../../style"; // Import the styles object
import "./authCss.css"
import { logo } from '../../assets';
function AuthPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  const switchToSignUp = () => {
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
  };

  return (
    <div className="bg-primary min-h-screen">
        <img src={logo} alt="CloudNest" className="w-[220px] h-[50px] ml-5" />
      <div className={`${styles.paddingX} ${styles.flexCenter}`} >
        <section className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
          <div className="absolute z-[0] w-96 h-48 -left-[700px] rounded-full blue__gradient bottom-40 " />
          
          <div className="flex justify-between flex-col px-8 py-9 rounded-[20px] h-120 w-164 md:mr-10 sm:mr-5 mr-0 my-0 plan-card">
            {showSignUp ? (
              <SignUp switchToSignIn={switchToSignIn} />
            ) : (
              <SignIn switchToSignUp={switchToSignUp} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;
