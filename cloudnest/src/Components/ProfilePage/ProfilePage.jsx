import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import { FaUser, FaEnvelope, FaLock, FaSave, FaEdit } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import { auth, firestore } from '../../firebase';
import { logo } from '../../assets';

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "./../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import 'firebase/auth';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setUsername(currentUser.displayName || ''); 
      setEmail(currentUser.email || '');
      setImageUrl(currentUser.photoURL || ''); 
      // Save user data to local storage
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      // Retrieve user data from local storage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setUsername(JSON.parse(storedUser).displayName || ''); 
        setEmail(JSON.parse(storedUser).email || '');
        setImageUrl(JSON.parse(storedUser).photoURL || ''); 
      }
    }
  }, []);

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
        email: email,
      });

      setUser({ ...user, displayName: username, email: email});
      // Update local storage with updated user data
      localStorage.setItem('user', JSON.stringify({ ...user, displayName: username, email: email }));
      
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

  const handleButtonClick = async () => {
    try {
      const currentUser = auth.currentUser;
      const docRef = doc(firestore, "users", currentUser.uid);

      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.accept = 'image/*';

      inputElement.onchange = async (event) => {
        const imageUploaded = event.target.files[0];
        const imageRef = ref(storage, `images/${currentUser.uid}/${imageUploaded.name}`);
        const snapshot = await uploadBytes(imageRef, imageUploaded);
        const imageUrl = await getDownloadURL(snapshot.ref);
        await updateProfile(auth.currentUser, { photoURL: imageUrl });
        await updateDoc(docRef, { imageUrl: imageUrl });
        setUser({ ...user,photoURL:imageUrl});
        setImageUrl(imageUrl);
        // Update local storage with updated user data
        localStorage.setItem('user', JSON.stringify({ ...user, photoURL: imageUrl }));
      };
      inputElement.click();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="bg-primary-profile min-h-screen">
      
      <div className="profile-container">
        <div className="profile-form">
          <div className="profile-header">
            <h1>My Profile</h1>
          </div>
          <div className="profile-content">
            <div>
              <Avatar
                alt="User Avatar"
                src={imageUrl}
                sx={{ width: 120, height: 120 }}
              />
              {isCurrentUserProfile && (
                <Button className="profile1-button" onClick={handleButtonClick}>
                  <EditIcon className="profile1-button" />
                </Button>
              )}
            </div>
            <div className="profile-details">
              <div className="profile-detail">
              <FaUser className="detail-label" />
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
              <FaEnvelope className="detail-label" />
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
              <FaLock className="detail-label" />
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
    </div>
  );
  
};

export default ProfilePage;
