import React from "react";
import StoragePercentage from "./Storage Percentage/StoragePercentage";
import "./Sidebar.css";
import logo from "../../../assets/CloudNestLogo.png";
import { auth } from "../../../firebase";
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const Sidebar = ({
  openFileUpload,
  closFileModal,
  openCreateFolder,
  closeCreateFolder,
  shouldRerender,
}) => {
  const navigate = useNavigate();
  const Logout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Redirect to the login or landing page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div className="Side h-full w-full w-1/4 p-4 flex flex-col justify-between">
      {/* Home Section */}
      <div>
        <div className="mb-4">
          <Link to="/profile">
            <img src={logo} className="w-52 h-12 mb-2"></img>
            <h2 className="flex ">
              <Avatar
                alt="User Avatar"
                src={auth.currentUser.photoUrl}
                sx={{ width: 60, height: 60 }}
              />
              <span className="flex justify-center items-center ml-2">
                Hello {auth.currentUser.displayName}
              </span>
            </h2>
          </Link>
          <button
            className="text-white font-semibold py-2 px-4 rounded w-full mb-2"
            onClick={Logout}
          >
            Logout
          </button>
          <StoragePercentage shouldRerender={shouldRerender} />
          {/* Add links or other content for the home section if needed */}
        </div>
      </div>

      {/* Upload File and Create Folder Buttons */}
      <div>
        <button
          className="file-button text-white font-semibold py-2 px-4 rounded w-full mb-2"
          onClick={() => {
            openFileUpload();
          }}
        >
          Upload File
        </button>

        <button
          className="folder-button text-white font-semibold py-2 px-4 rounded w-full"
          onClick={() => {
            openCreateFolder();
          }}
        >
          Create Folder
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
