import React from "react";
import "../Modal.css";
import CreateFolder from "../../MainPageComponents/CreateFolder/CreateFolder";

const CreateFolderModal = ({
  isOpenFolder,
  onCloseFolder,
  Rerender,
  currentPath,
}) => {
  if (!isOpenFolder) return null;

  return (
    <div className="modal-overlay" onClick={onCloseFolder}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <CreateFolder Rerender={Rerender} currentPath={currentPath} />
        <button onClick={onCloseFolder} className="Close-Button">
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateFolderModal;
