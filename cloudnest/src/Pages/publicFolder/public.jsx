import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { FaFolder, FaFile } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { getAuth } from "firebase/auth";
const Public = () => {
  const storage = getStorage();
  const [files, setFiles] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const firebaseRef = `files/${user.uid}/`;
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("Fetching files from Firebase:", firebaseRef);
        const folderRef = ref(storage, firebaseRef);
        const fileList = await listAll(folderRef);

        const filePromises = fileList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, isFolder: false, url };
        });

        const filesData = await Promise.all(filePromises);
        const folderNames = fileList.prefixes.map((prefix) => ({
          name: prefix.name,
          isFolder: true,
        }));

        console.log("Files:", filesData);
        console.log("Folders:", folderNames);

        setFiles([...filesData, ...folderNames]);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [firebaseRef, storage]);

  return (
    <div>
      <h2>File Explorer</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.isFolder ? (
              <span>
                <FaFolder /> {file.name}
              </span>
            ) : (
              <span>
                <FaFile /> {file.name}
                {file.url && (
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <FiDownload />
                  </a>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Public;
