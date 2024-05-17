import React, { useState, useEffect, useRef} from 'react';
import Loader from '../Loader';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField } from '@mui/material';
import { FaSave, FaUser, FaEnvelope, FaLock, FaEdit } from 'react-icons/fa';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import EditIcon from '@mui/icons-material/Edit';
import { storage } from "./../../firebase";
import { auth, firestore } from '../../firebase';
import { logo } from '../../assets';
import Snackbar from '../Snackbar/Snackbar';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from "firebase/auth";
import './ProfilePage.css';
import {Link,useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editField, setEditField] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Free Plan');
  const editRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const toDisplay = "Profile Edited Successfully";
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [openCurrentPasswordDialog, setOpenCurrentPasswordDialog] = useState(false);
  const navigate = useNavigate();



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
      setLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName: username });
        if (email && email !== currentUser.email) {
          setCurrentPasswordInput('');
          setOpenCurrentPasswordDialog(true);
          const credential = EmailAuthProvider.credential(currentUser.email, currentPasswordInput);
          await reauthenticateWithCredential(currentUser, credential);
          handleCloseCurrentPasswordDialog();
          await updateEmail(currentUser, email);
        }
        if (password) {
          setCurrentPasswordInput('');
          setOpenCurrentPasswordDialog(true);
          const credential = EmailAuthProvider.credential(currentUser.email, currentPasswordInput);
          await reauthenticateWithCredential(currentUser, credential);
          handleCloseCurrentPasswordDialog();
          await updatePassword(currentUser, password);
          setPassword('');
        }
        const docRef = doc(firestore, "users", currentUser.uid);
        await updateDoc(docRef, { username: username, email: email });

        setUser({ ...user, displayName: username, email: email });
        localStorage.setItem('user', JSON.stringify({ ...user, displayName: username, email: email }));

        setIsEditingUsername(false);
        setIsEditingEmail(false);
        setIsEditingPassword(false);
        setShowSnackbar(true);
        setEditField('');
        setLoading(false);
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
    setOpenProfileDialog(false);
  };
  const handleLogOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      navigate("/");

    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  
  const handleCloseCurrentPasswordDialog = () => {
    setOpenCurrentPasswordDialog(false);
    setCurrentPasswordInput('');
  };
  return (
    <div className="bg-primary-profile min-h-screen">
      <div>
        {loading && <Loader loading={loading} />}
      </div>
      {showSnackbar && <Snackbar showSnackbar={showSnackbar} setShowSnackbar={setShowSnackbar} toDisplay={toDisplay} />}
      <div className='header-profile'>
      <img src={logo} alt="CloudNest" className=" w-[220px] h-[50px] ml-5" />
      <Link to='/feed'><Button >View Feed</Button></Link>
      </div>
      <div className="profile-container">
        <div className="profile-form">
          <div className="profile-header">
            <h1>My Profile</h1>
            <Button  onClick={handleLogOut}>Log Out</Button>
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
                  <FaEdit className="edit-icon" onClick={handleOpenProfileDialog} />
                </>
              </div>
            </div>
          </div>
          <Dialog open={openCurrentPasswordDialog} PaperProps={{
            style: {
              backgroundColor: '#0f1042',
              color: '#fff'
            },
          }} onClose={handleCloseCurrentPasswordDialog}>
  <DialogTitle>Enter Current Password</DialogTitle>
  <DialogContent className='t' PaperProps={{
                style: {
                  color: '#fff'
                },
              }}>
    <TextField
      type="password"
      label="Current Password"
      value={currentPasswordInput}
      onChange={(e) => setCurrentPasswordInput(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseCurrentPasswordDialog} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSaveChanges} color="primary">
      Confirm
    </Button>
  </DialogActions>
</Dialog>

          <Dialog open={openProfileDialog} PaperProps={{
            style: {
              backgroundColor: '#0f1042',
              color: '#fff'
            },
          }} onClose={() => setOpenProfileDialog(false)}>
            <DialogTitle>Select Plan</DialogTitle>
            <DialogContent >
              <DialogContentText className='t' PaperProps={{
                style: {
                  color: '#fff'
                },
              }}>
                Please select your plan:
              </DialogContentText>
              <div>
                <Button onClick={() => handleSelectPlan('Free Plan')} variant={selectedPlan === 'Free Plan' ? 'contained' : 'outlined'}>Free Plan</Button>
                <Button onClick={() => handleSelectPlan('CloudNest PLUS')} variant={selectedPlan === 'CloudNest PLUS' ? 'contained' : 'outlined'}>CloudNest PLUS</Button>
                <Button onClick={() => handleSelectPlan('CloudNest SUPER')} variant={selectedPlan === 'CloudNest SUPER' ? 'contained' : 'outlined'}>CloudNest SUPER</Button>
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
