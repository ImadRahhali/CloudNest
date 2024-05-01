import React from "react";
import Sidebar from "../Components/MainPageComponents/SideBar/Sidebar";
import FileUpload from "../Components/MainPageComponents/FileUpload/FileUpload";
import ListFiles from "../Components/MainPageComponents/User Files/ListFiles";
import { useState } from "react";

const Main = () => {
  const [shouldRerender, setShouldRerender] = useState(false);
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
          <FileUpload onMouseEnter={Rerender} Rerender={Rerender} />
        </div>

        {/* List Files */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
          <ListFiles shouldRerender={shouldRerender} />
        </div>
      </div>
    </div>
  );
};

export default Main;
