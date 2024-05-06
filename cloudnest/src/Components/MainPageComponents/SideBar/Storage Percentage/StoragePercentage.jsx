import React, { useState, useEffect } from "react";
import { auth } from "../../../../firebase";
import { getStorage, ref, listAll, getMetadata, list } from "firebase/storage";
import "./storage.css";

const StoragePercentage = ({ shouldRerender }) => {
  const storage = getStorage();
  const [storageUsed, setStorageUsed] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);

  useEffect(() => {
    const fetchStorageInfo = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated.");

        const storageRef = ref(storage, `files/${user.uid}`);
        const totalSize = await calculateStorageSize(storageRef);

        // Convert bytes to GB
        const totalSizeGB = totalSize / (1024 * 1024 * 1024);
        const storagePercentage = (totalSizeGB / 10) * 100;
        setStorageUsed(totalSizeGB);
        setStoragePercentage(storagePercentage);
      } catch (error) {
        console.error("Error fetching storage info:", error);
      }
    };

    fetchStorageInfo();
  }, [auth, storage, shouldRerender]);

  // Function to calculate total size of all files within folders and subfolders
  const calculateStorageSize = async (storageRef) => {
    let totalSize = 0;

    const items = await listAll(storageRef);

    // Iterate through each item in the folder
    await Promise.all(
      items.items.map(async (item) => {
        if (item.isDirectory) {
          // Recursively calculate size of files within subfolders
          totalSize += await calculateStorageSize(item);
        } else {
          // Get metadata of file and add its size to total
          const metadata = await getMetadata(item);
          totalSize += metadata.size;
        }
      })
    );

    return totalSize;
  };

  return (
    <div className="storage-percentage-container">
      <h2 className="text-2xl font-bold mb-4">Storage Usage</h2>
      <div className="storage-details">
        <p className="storage-info">
          Storage Used: {storageUsed.toFixed(2)} GB
        </p>
        <p className="storage-info">
          Storage Percentage: {storagePercentage.toFixed(2)}%
        </p>
      </div>
      <div className="storage-bar">
        <div
          className="filled-bar"
          style={{ width: `${storagePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StoragePercentage;
