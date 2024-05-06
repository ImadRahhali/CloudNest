import { auth } from "../../../firebase";
// Assuming you also export 'firestore' from firebase.js
import { getStorage, ref, uploadString, deleteObject } from "firebase/storage";
const storage = getStorage();

// Function to check if a folder with the given name exists for the current user
const checkFolderExists = async (folderName) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }

    const folderRef = ref(
      storage,
      `${currentUser.uid}/${folderName}/placeholder.txt`
    );
    const metadata = await folderRef.getMetadata();
    return !!metadata; // If metadata exists, folder exists
  } catch (error) {
    console.error("Error checking folder existence:", error);
    return false;
  }
};

// Function to create a folder with the given name for the current user
const createFolder = async (folderName, currentPath) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }

    const folderRef = ref(
      storage,
      `files/${currentUser.uid}${currentPath}${folderName}/placeholder.txt`
    );
    await uploadString(folderRef, ""); // Upload an empty string as a placeholder file
    console.log(`Folder "${folderName}" created successfully.`);
  } catch (error) {
    console.error("Error creating folder:", error);
  }
};

export { checkFolderExists, createFolder };
