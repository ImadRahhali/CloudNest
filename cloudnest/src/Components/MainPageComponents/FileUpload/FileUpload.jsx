import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const FileUpload = ({ Rerender, currentPath }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [uploading, setUploading] = useState(false);
  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const file = event.target.files[0]; // Get the uploaded file from event

      if (!file) return; // Check if file is not null

      const storageRef = ref(
        storage,
        `files/${user.uid}${currentPath}${file.name}`
      );
      await uploadBytes(storageRef, file);

      // Update files state to include the newly uploaded file
      console.log("File uploaded:", file.name);
      Rerender();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500"
      >
        {uploading ? (
          <p className="text-gray-500 dark:text-gray-400">Uploading...</p>
        ) : (
          <>
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
};

export default FileUpload;
