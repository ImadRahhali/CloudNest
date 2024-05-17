import React,{ useState, useEffect} from "react";
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
  const [imageUrl, setImageUrl] = useState('');
  const [username, setUsername] = useState('');

  const Logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setImageUrl(parsedUser.photoURL || '');
      setUsername(parsedUser.displayName || '');

    }
  }, []);
  return (
    <div className="Side h-full w-full w-1/4 p-4 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <Link to="/profile">
            <img src={logo} className="w-52 h-12 mb-2"></img>
            <h2 className="flex ">
              <Avatar
                alt="User Avatar"
                src={imageUrl}
                sx={{ width: 60, height: 60 }}
              />
              <span className="flex justify-center items-center ml-2">
                Hello {username}
              </span>
            </h2>
          </Link>
          <button
            className="text-white font-semibold py-2 px-4 rounded w-full mb-2 logout-button"
            onClick={Logout}
          >
            Logout
          </button>
          <StoragePercentage shouldRerender={shouldRerender} />
        </div>
      </div>
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
