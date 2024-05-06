import React from "react";
import FileUpload from "../../MainPageComponents/FileUpload/FileUpload";
import "../Modal.css";

const UploadFileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <FileUpload />
        <button onClick={onClose} className="Close-Button">
          Close
        </button>
      </div>
    </div>
  );
};

export default UploadFileModal;
