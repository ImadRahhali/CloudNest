import React, { useState, useEffect, useRef } from 'react';
import Loader from '../Loader';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField ,DialogContentText} from '@mui/material';
import { FaSave, FaUser, FaEnvelope, FaLock, FaEdit } from 'react-icons/fa';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import EditIcon from '@mui/icons-material/Edit';
import { storage } from "./../../firebase";
import { auth, firestore } from '../../firebase';
import { logo } from '../../assets';
import Snackbar from '../Snackbar/Snackbar';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile, verifyBeforeUpdateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from "firebase/auth";
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [imageUrl, setImageUrl] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false); // Define isEditingUsername state
  const [isEditingEmail, setIsEditingEmail] = useState(false); // Define isEditingEmail state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Normal Plan');
  const [showPremiumEditWindow, setShowPremiumEditWindow] = useState(false); // Manage premium edit window visibility
  const editRef = useRef(null); // Ref for the edit input
  const [loading, setLoading] = useState(false);
  const [showSnackbar,setShowSnackbar] = useState(false);
  const toDisplay = "Profile Edited Succesfully";


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the editRef exists and if the click is outside the editRef element
      if (editRef.current && !editRef.current.contains(event.target)) {
        // Check which input field is being edited and close it accordingly
        if (isEditingUsername) {
          setUsername(user.displayName || ''); // Reset the username input if changes were not saved
          setIsEditingUsername(false); // Close the username input
        }
        if (isEditingEmail) {
          setEmail(user.email || ''); // Reset the email input if changes were not saved
          setIsEditingEmail(false); // Close the email input
        }
        if (isEditingPassword) {
          setPassword(''); // Reset the password input if changes were not saved
          setIsEditingPassword(false); // Close the password input
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editRef, isEditingUsername, isEditingEmail, isEditingPassword, user]);
  

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.displayName || '');
      setEmail(parsedUser.email || '');
      setImageUrl(parsedUser.photoURL || '');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Update profile display name
        await updateProfile(currentUser, { displayName: username });

        // Check if the email needs to be updated
        if (email && email !== currentUser.email) {
          // Reauthenticate the user before updating email
          const currentPassword = prompt('Enter your current password:');
          const credential = EmailAuthProvider.credential(currentUser.email, currentPassword); // Create credential object
          await reauthenticateWithCredential(currentUser, credential); // Reauthenticate using credential
          await updateEmail(currentUser, email);
          // Email updated successfully
        }

        // Update password if provided
        if (password) {
          // Reauthenticate the user before updating password
          const currentPassword = prompt('Enter your current password:');
          const credential = EmailAuthProvider.credential(currentUser.email, currentPassword); // Create credential object
          await reauthenticateWithCredential(currentUser, credential); // Reauthenticate using credential
          await updatePassword(currentUser, password);
          setPassword(''); // Clear password field
        }

        // Update Firestore document
        const docRef = doc(firestore, "users", currentUser.uid);
        await updateDoc(docRef, { username: username, email: email });

        setUser({ ...user, displayName: username, email: email });
        localStorage.setItem('user', JSON.stringify({ ...user, displayName: username, email: email }));

        setIsEditingUsername(false);
        setIsEditingEmail(false);
        setIsEditingPassword(false);
        setShowSnackbar(true);
        console.log("Document written with ID: ", docRef.id);
        console.log("Username:", currentUser.displayName);
        console.log("Email:", currentUser.email);
        
      }
    } catch (error) {
      console.error('Error updating Firestore:', error.message);
    }
  };

  const handleButtonClick = async () => {
    try {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.accept = 'image/*';
      inputElement.onchange = async (event) => {
        setLoading(true);
        const imageUploaded = event.target.files[0];
        const imageRef = ref(storage, `images/${user.uid}/${imageUploaded.name}`);
        const snapshot = await uploadBytes(imageRef, imageUploaded);
        const imageUrl = await getDownloadURL(snapshot.ref);
        await updateProfile(auth.currentUser, { photoURL: imageUrl });
        await updateDoc(doc(firestore, "users", user.uid), { imageUrl: imageUrl });
        setUser({ ...user, photoURL: imageUrl });
        setImageUrl(imageUrl);
        localStorage.setItem('user', JSON.stringify({ ...user, photoURL: imageUrl }));
        setLoading(false);
      };
      inputElement.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(true);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPlan = () => {
    // Here you can handle the logic for updating the selected plan in your state or database
    setOpenProfileDialog(false);
  };

  return (
    <div className="bg-primary-profile min-h-screen">
        <div>
        {loading && <Loader loading={loading} />}
      </div>
      {showSnackbar && <Snackbar showSnackbar={showSnackbar} setShowSnackbar={setShowSnackbar} toDisplay={toDisplay}/>}
      <img src={logo} alt="CloudNest" className="logo-profile w-[220px] h-[50px] ml-5" />
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
              <Button className="profile1-button" onClick={handleButtonClick}>
                <EditIcon className="profile1-button" />
              </Button>
            </div>
            <div className="profile-details">
              <div className="profile-detail">
                <FaUser className="detail-label" />
                {editField === 'username' ? (
                  <>
                    <input
                      ref={editRef}
                      className='inputs1'
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={username}
                      onChange={handleInputChange}
                    />
                    <Button onClick={handleSaveChanges}><FaSave className="save-icon" /></Button>
                  </>
                ) : (
                  <>
                    <span>{username}</span>
                    <FaEdit className="edit-icon" onClick={() => setEditField('username')} />
                  </>
                )}
              </div>
              <div className="profile-detail">
                <FaEnvelope className="detail-label" />
                {editField === 'email' ? (
                  <>
                    <input
                      ref={editRef}
                      className='inputs1'
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                    />
                    <Button onClick={handleSaveChanges}><FaSave className="save-icon" /></Button>
                  </>
                ) : (
                  <>
                    <span>{email}</span>
                    <FaEdit className="edit-icon" onClick={() => setEditField('email')} />
                  </>
                )}
              </div>
              <div className="profile-detail">
                <FaLock className="detail-label" />
                {editField === 'password' ? (
                  <>
                    <input
                      ref={editRef}
                      className='inputs1'
                      type="password"
                      placeholder="New Password"
                      name="password"
                      value={password}
                      onChange={handleInputChange}
                    />
                    <Button onClick={handleSaveChanges}><FaSave className="save-icon" /></Button>
                  </>
                ) : (
                  <>
                    <span>*******</span>
                    <FaEdit className="edit-icon" onClick={() => setEditField('password')} />
                  </>
                )}
              </div>
              <div className="profile-detail">
              <CardMembershipIcon className="detail-label" />
                <>
                  <span>{selectedPlan}</span>
                  {/* Premium Plan edit button */}
                  <FaEdit className="edit-icon" onClick={handleOpenProfileDialog} />
                </>
            </div>
            </div>
          </div>
          <Dialog open={openProfileDialog}     PaperProps={{
      style: {
        backgroundColor:'#0f1042',
        color:'#fff'
      },
    }} onClose={() => setOpenProfileDialog(false)}>
        <DialogTitle>Select Plan</DialogTitle>
        <DialogContent >
          <DialogContentText className='t' PaperProps={{
      style: {
        color:'#fff' 
      },
    }}>
            Please select your plan:
          </DialogContentText>
          {/* Buttons for plan selection */}
          <div>
            <Button onClick={() => handleSelectPlan('Normal Plan')} variant={selectedPlan === 'Normal Plan' ? 'contained' : 'outlined'}>Normal Plan</Button>
            <Button onClick={() => handleSelectPlan('Premium Plan')} variant={selectedPlan === 'Premium Plan' ? 'contained' : 'outlined'}>Premium Plan</Button>
            <Button onClick={() => handleSelectPlan('Super Premium')} variant={selectedPlan === 'Super Premium' ? 'contained' : 'outlined'}>Super Premium</Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPlan} color="primary" disabled={!selectedPlan}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
