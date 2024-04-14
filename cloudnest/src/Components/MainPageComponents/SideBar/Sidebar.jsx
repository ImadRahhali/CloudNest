import React from "react";

const Sidebar = ({ onUploadFile, onCreateFolder }) => {
  return (
    <div className="h-full w-full bg-gray-200 w-1/4 p-4 flex flex-col justify-between">
      {/* Home Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Home</h2>
          {/* Add links or other content for the home section if needed */}
        </div>
      </div>

      {/* Upload File and Create Folder Buttons */}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mb-2"
          onClick={onUploadFile}
        >
          Upload File
        </button>

        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
          onClick={onCreateFolder}
        >
          Create Folder
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
