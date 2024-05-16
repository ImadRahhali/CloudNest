import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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
import { FiDownload, FiFolderPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Public = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawFolderPath = decodeURIComponent(
    location.pathname.replace("/public/", "")
  );
  const folderPath = rawFolderPath.endsWith("/")
    ? rawFolderPath
    : `${rawFolderPath}/`;

  const storage = getStorage();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log(`Fetching files from path: files/${folderPath}`);
        const storageRef = ref(storage, `files/${folderPath}`);
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
  }, [storage, folderPath]);

  const handleNavigate = (folderName) => {
    navigate(`/public/${folderPath}${folderName}/`);
  };

  const handleDownload = async (fileName) => {
    try {
      const fileRef = ref(storage, `files/${folderPath}${fileName}`);
      const url = await getDownloadURL(fileRef);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
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
    <div className="fileExp files max-w-screen-md mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        {files.map((file, index) => (
          <div
            key={`file-${index}`}
            className="flex items-center border-b file-line py-2 pb-4"
          >
            <div className="icon mr-4">{renderFileIcon(file)}</div>
            <span className="truncate flex-grow">{file.name}</span>
            <div className="ml-4">
              {file.type === "file" && (
                <>
                  <FiDownload
                    className="text-gray-400 cursor-pointer icon mr-2"
                    onClick={() => handleDownload(file.name)}
                  />
                </>
              )}
              {file.type === "folder" && (
                <>
                  <FiFolderPlus
                    className="text-gray-400 cursor-pointer hover:text-gray-600 mr-2"
                    onClick={() => handleNavigate(file.name)}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Public;
