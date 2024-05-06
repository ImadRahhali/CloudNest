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
  FaFolder,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileAlt,
} from "react-icons/fa";
import { FiDownload, FiTrash2, FiFolderPlus, FiArrowUp } from "react-icons/fi";
import { MdLink } from "react-icons/md";
import { IconContext } from "react-icons";

const ListFiles = ({ shouldRerender, currentPath, setCurrentPath }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [copied, setCopied] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated.");

        const storageRef = ref(storage, `files/${user.uid}/${currentPath}`);
        const fileList = await listAll(storageRef);
        const fileNames = fileList.items.map((item) => ({
          name: item.name,
          type: "file",
        }));
        const folderNames = fileList.prefixes.map((prefix) => ({
          name: prefix.name,
          type: "folder",
        }));

        setFiles([...folderNames, ...fileNames]);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [auth, storage, shouldRerender, currentPath]);

  const handleNavigate = (folderName) => {
    setCurrentPath((prevPath) => `${prevPath}${folderName}/`);
  };

  const navigateUp = () => {
    const newPath = currentPath.split("/").slice(0, -2).join("/") + "/";
    setCurrentPath(newPath);
  };

  const handleDownload = async (fileName) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const fileRef = ref(
        storage,
        `files/${user.uid}/${currentPath}${fileName}`
      );
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

      const fileRef = ref(
        storage,
        `files/${user.uid}/${currentPath}${fileName}`
      );
      const url = await getDownloadURL(fileRef);

      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const handleRemove = async (file) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const fileRef = ref(
        storage,
        `files/${user.uid}/${currentPath}${file.name}`
      );
      if (file.type === "folder") {
        // Delete folder and all its contents
        const fileList = await listAll(fileRef);
        await Promise.all(fileList.items.map((item) => deleteObject(item)));
      }
      await deleteObject(fileRef);
      setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
    } catch (error) {
      console.error("Error removing file or folder:", error);
    }
  };

  const renderFileIcon = (file) => {
    if (file.type === "folder") {
      return <FaFolder />;
    }
    const extension = file.name.split(".").pop().toLowerCase();
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Files</h2>
        <div>
          {currentPath && (
            <button
              onClick={navigateUp}
              className="btn btn-secondary flex items-center space-x-1"
            >
              <FiArrowUp size="1.5em" />
              <span>Go Up</span>
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {files.map((file, index) => (
          <div
            key={`file-${index}`}
            className="flex items-center border-b border-gray-200 py-2"
          >
            <IconContext.Provider
              value={{ size: "1.5rem", className: "text-gray-600 mr-4" }}
            >
              {renderFileIcon(file)}
            </IconContext.Provider>
            <span className="truncate flex-grow">{file.name}</span>
            <div className="ml-4">
              {file.type === "file" && (
                <>
                  <FiDownload
                    className="text-gray-400 cursor-pointer hover:text-gray-600 mr-2"
                    onClick={() => handleDownload(file.name)}
                  />
                  <MdLink
                    className="text-gray-400 cursor-pointer hover:text-gray-600 mr-2"
                    onClick={() => handleShare(file.name)}
                  />
                  <FiTrash2
                    className="text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={() => handleRemove(file)}
                  />
                </>
              )}
              {file.type === "folder" && (
                <FiFolderPlus
                  className="text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => handleNavigate(file.name)}
                />
              )}
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
