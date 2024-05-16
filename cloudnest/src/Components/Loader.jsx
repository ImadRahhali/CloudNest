import React from 'react';
import BounceLoader from "react-spinners/BounceLoader";
import { logo } from '../assets';

const LoadingPage = ({ loading }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-popup">
        <BounceLoader color="#0f1042" loading={loading} size={150} aria-label="CloudNest" />
        <span className="loading-text">CloudNest</span>
      </div>
      <div>
        <img src={logo} alt="CloudNest" className="logo-profile w-[220px] h-[50px] ml-5" />
      </div>
    </div>
  );
};

export default LoadingPage;
