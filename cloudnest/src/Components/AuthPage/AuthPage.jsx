import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import styles from "../../style"; // Import the styles object
import "./authCss.css"
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
      <div className={`${styles.paddingX} ${styles.flexCenter}`} >
        <section className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
          <div className="absolute z-[0] w-48 h-48 -right-24 rounded-full blue__gradient bottom-40" />
          <div className="absolute z-[0] w-48 h-48 right-0 rounded-full blue__gradient bottom-40" />
          
          <div className="flex justify-between flex-col px-10 py-12 rounded-[20px] h-96 w-140 md:mr-10 sm:mr-5 mr-0 my-5 plan-card">
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
