import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSave, FaEdit } from 'react-icons/fa'; // Added FaEdit icon
import { auth, firestore } from '../../firebase';
import { updateDoc, doc} from "firebase/firestore"; 
import {updateProfile } from "firebase/auth";
import 'firebase/auth';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setUsername(JSON.parse(storedUser).displayName); // Set initial username
      setEmail(JSON.parse(storedUser).email); // Set initial email
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.error('Access to protected route denied, redirecting to login...');
        navigate('/auth');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
        const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(auth.currentUser, { displayName: username });
    }

      const docRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(docRef, {
        username: username,
        email:email,
      });
      alert('Changes saved successfully!');
      setIsEditingUsername(false);
      setIsEditingEmail(false);
      setIsEditingPassword(false);
      console.log("Document written with ID: ", docRef.id);
      console.log("Username:", currentUser.displayName);
      console.log("Email:", currentUser.email);

    } catch (error) {
        console.error('Error updating Firestore:', error.message);
    }
  };

  return (
    <div className="bg-primary min-h-screen">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>
        <div className="profile-content">
          <div className="profile-picture">
            <img src="profile-pic.jpg" alt="Profile" />
          </div>
          <div className="profile-details">
            <div className="profile-detail">
              <FaUser className="icon" />
              {isEditingUsername ? (
                <>
                  <input
                    className='inputs'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    
                  />
                  <FaSave className="save-icon" onClick={handleSaveChanges} />
                </>
              ) : (
                <>
                  <span>{username}</span>
                  <FaEdit className="edit-icon" onClick={() => setIsEditingUsername(true)} />
                </>
              )}
            </div>
            <div className="profile-detail">
              <FaEnvelope className="icon" />
              {isEditingEmail ? (
                <>
                  <input
                    className='inputs'
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <FaSave className="save-icon" onClick={handleSaveChanges} />
                </>
              ) : (
                <>
                  <span>{email}</span>
                  <FaEdit className="edit-icon" onClick={() => setIsEditingEmail(true)} />
                </>
              )}
            </div>
            <div className="profile-detail">
              <FaLock className="icon" />
              {isEditingPassword ? (
                <>
                  <input
                    className='inputs'
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <FaSave className="save-icon" onClick={handleSaveChanges} />
                </>
              ) : (
                <>
                  <span>*****</span>
                  <FaEdit className="edit-icon" onClick={() => setIsEditingPassword(true)} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
