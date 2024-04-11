import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("user signup : " ,userCredential.user)
  })
  .catch((error) => {
    console.log(error)
  });
  console.log("signUp success");

  };

  return (
    <div><h2>SignUp</h2>
    <form onSubmit={handleSignUp}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
    </div>
  );
}

export default SignUp;
