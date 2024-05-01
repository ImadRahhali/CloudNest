import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import {
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileAlt,
} from "react-icons/fa"; // Import specific file icons
import { FiDownload, FiTrash2, FiShare2 } from "react-icons/fi"; // Import common icons for download, trash, and share
import { MdLink } from "react-icons/md"; // Import icon for link
import { IconContext } from "react-icons"; // Import IconContext for icon styling

const ListFiles = ({ shouldRerender }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [copied, setCopied] = useState(false); // State to track if the link is copied
  const [files, setFiles] = useState([]);
  useEffect(() => {
    console.log("re-rendering list files component");
    const fetchFiles = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated.");

        const storageRef = ref(storage, `files/${user.uid}`);
        const fileList = await listAll(storageRef);
        const fileNames = fileList.items.map((item) => item.name);
        setFiles(fileNames);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [auth, storage, shouldRerender]);

  const handleDownload = async (fileName) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const fileRef = ref(storage, `files/${user.uid}/${fileName}`);
      const url = await getDownloadURL(fileRef);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleShare = async (fileName) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const fileRef = ref(storage, `files/${user.uid}/${fileName}`);
      const url = await getDownloadURL(fileRef);

      // Copy file URL to clipboard
      await navigator.clipboard.writeText(url);

      // Set copied state to true to display the copied message
      setCopied(true);

      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const handleRemove = async (fileName) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const fileRef = ref(storage, `files/${user.uid}/${fileName}`);
      await deleteObject(fileRef);
      setFiles((prevFiles) => prevFiles.filter((file) => file !== fileName));
      console.log("File removed:", fileName);
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  // Function to render file icon based on file extension
  const renderFileIcon = (fileName) => {
    if (!fileName) {
      fileName = "DefaultName";
    }
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaFilePdf />;
      case "doc":
      case "docx":
        return <FaFileWord />;
      case "xls":
      case "xlsx":
        return <FaFileExcel />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <FaFileImage />;
      case "mp3":
      case "wav":
        return <FaFileAudio />;
      case "mp4":
      case "avi":
      case "mov":
        return <FaFileVideo />;
      default:
        return <FaFileAlt />;
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Files</h2>
      <div className="grid grid-cols-1 gap-4">
        {files.map((fileName, index) => (
          <div
            key={index}
            className="flex items-center border-b border-gray-200 py-2"
          >
            <IconContext.Provider
              value={{ size: "1.5rem", className: "text-gray-600 mr-4" }}
            >
              {renderFileIcon(fileName)}
            </IconContext.Provider>
            <span className="truncate flex-grow">{fileName}</span>
            <div className="ml-4">
              <FiDownload
                className="text-gray-400 cursor-pointer hover:text-gray-600 mr-2"
                onClick={() => handleDownload(fileName)}
              />
              <MdLink
                className="text-gray-400 cursor-pointer hover:text-gray-600 mr-2"
                onClick={() => handleShare(fileName)}
              />
              <FiTrash2
                className="text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => handleRemove(fileName)}
              />
            </div>
          </div>
        ))}
      </div>
      {copied && (
        <div className="text-green-600">Link copied to clipboard!</div>
      )}
    </div>
  );
};

export default ListFiles;
