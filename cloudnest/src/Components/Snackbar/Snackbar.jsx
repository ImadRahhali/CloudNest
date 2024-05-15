import React, { useEffect } from "react";
import "./Snackbar.css";

const Snackbar = ({ showSnackbar, setShowSnackbar }) => {
  useEffect(() => {
    const timeout = setTimeout(() => setShowSnackbar(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    { showSnackbar } && (
      <div className="snackbar">Link copied to clipboard!</div>
    )
  );
};

export default Snackbar;
