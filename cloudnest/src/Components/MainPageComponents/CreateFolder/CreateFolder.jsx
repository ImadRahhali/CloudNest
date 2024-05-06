import React, { useState } from "react";
import { checkFolderExists, createFolder } from "./FirebaseFunctions"; // assuming firebase functions are defined in firebaseFunctions.js
import "./CreateFolder.css"; // Importing CSS file for styling

function CreateFolder({ Rerender, currentPath }) {
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateFolder = async () => {
    if (!folderName) {
      setMessage("Please enter a folder name.");
      return;
    }

    const folderExists = await checkFolderExists(folderName);

    if (folderExists) {
      setMessage(`Folder with name "${folderName}" already exists.`);
    } else {
      await createFolder(folderName, currentPath);
      setMessage(`Folder "${folderName}" created successfully.`);
      Rerender();
      setFolderName("");
    }
  };

  return (
    <div className="folder-manager">
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Enter folder name"
        className="folder-input"
      />
      <button onClick={handleCreateFolder} className="create-folder-button">
        Create Folder
      </button>
      <p className="message">{message}</p>
    </div>
  );
}

export default CreateFolder;
