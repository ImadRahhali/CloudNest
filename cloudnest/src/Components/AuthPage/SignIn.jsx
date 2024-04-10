import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";


function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = (e) => {
    e.preventDefault();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("user logged : " ,userCredential.user)

  })
  .catch((error) => {
    console.log(error)

  });
    console.log("signin success");
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
