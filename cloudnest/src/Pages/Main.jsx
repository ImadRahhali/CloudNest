import React from "react";
import Sidebar from "../Components/MainPageComponents/SideBar/Sidebar";
import FileUpload from "../Components/MainPageComponents/FileUpload/FileUpload";
import ListFiles from "../Components/MainPageComponents/User Files/ListFiles";
import { useState } from "react";

const Main = () => {
  const [files, setFiles] = useState([]);
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* File Upload */}
        <div className="w-full p-4 bg-gray-100 border-b border-gray-300">
          <FileUpload files={files} setFiles={setFiles} />
        </div>

        {/* List Files */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
          <ListFiles files={files} setFiles={setFiles} />
        </div>
      </div>
    </div>
  );
};

export default Main;
