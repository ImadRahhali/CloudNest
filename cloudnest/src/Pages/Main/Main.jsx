import React from "react";
import Sidebar from "../../Components/MainPageComponents/SideBar/Sidebar";
import FileUpload from "../../Components/MainPageComponents/FileUpload/FileUpload";
import ListFiles from "../../Components/MainPageComponents/User Files/ListFiles";
import { useState } from "react";
import UploadFileModal from "../../Components/Modals/Upload File modal/UploadFileModal";
import CreateFolderModal from "../../Components/Modals/Create Folder Modal/CreateFolderModal";
import Snackbar from "../../Components/Snackbar/Snackbar";
import "./Main.css";
const Main = () => {
  /*Snackbar state management */
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [shouldRerender, setShouldRerender] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const Rerender = (filename) => {
    setTimeout(() => {
      setShouldRerender(!shouldRerender);
    }, 6000);
    console.log(
      "File Uploaded From Main.jsx :",
      filename,
      " Should rerender =",
      shouldRerender
    );
  };
  //Dialogues States

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenFolder, setIsModalOpenFolder] = useState(false);
  const openFileModal = () => {
    setIsModalOpen(true);
  };

  const closeFileModal = () => {
    setIsModalOpen(false);
  };
  const openFolderModal = () => {
    setIsModalOpenFolder(true);
  };

  const closeFolderModal = () => {
    setIsModalOpenFolder(false);
  };
  return (
    <div className="main flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200">
        <Sidebar
          openFileUpload={openFileModal}
          closeFileUpload={closeFileModal}
          openCreateFolder={openFolderModal}
          closeFolderModal={closeFolderModal}
          shouldRerender={shouldRerender}
        />
      </div>

      {/* Main Content */}
      <div className="main flex-grow flex flex-col">
        {/* File Upload */}
        <div className="main container-file-upload w-full p-4 bg-gray-100">
          <FileUpload Rerender={Rerender} currentPath={currentPath} />
        </div>

        {/* List Files */}
        <div className="main flex-grow p-4 overflow-y-auto">
          <ListFiles
            shouldRerender={shouldRerender}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            Rerender={Rerender}
          />
          {showSnackbar && (
            <Snackbar
              showSnackbar={showSnackbar}
              setShowSnackbar={setShowSnackbar}
            />
          )}
        </div>
      </div>
      <UploadFileModal
        isOpen={isModalOpen}
        onClose={closeFileModal}
        className="modal-overlay modal"
      />
      <CreateFolderModal
        isOpenFolder={isModalOpenFolder}
        onCloseFolder={closeFolderModal}
        className="modal-overlay modal"
        Rerender={Rerender}
        currentPath={currentPath}
      />
    </div>
  );
};

export default Main;
