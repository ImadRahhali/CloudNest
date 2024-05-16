import React, { useEffect } from "react";
import "./Snackbar.css";

const Snackbar = ({ showSnackbar, setShowSnackbar , toDisplay}) => {
  useEffect(() => {
    const timeout = setTimeout(() => setShowSnackbar(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    { showSnackbar } && (
      <div className="snackbar">{toDisplay}</div>
    )
  );
};

export default Snackbar;
