import React from "react";
import { plansicons } from "../../constants";

const PlansCard = ({ title, characteristics }) => (
  <div className="flex justify-between flex-col px-10 py-12 rounded-[20px] max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 plan-card">
    <h4 className="font-poppins font-bold text-[28px] leading-[32px] text-custom-blue mb-12 ">
      {title}
    </h4>
    <ul className="font-poppins font-normal text-[18px] leading-[32.4px] text-white mb-5">
      {characteristics.map((item, index) => {
        const { icon: IconComponent } = plansicons[index]; 
        return (
          <li key={index} className="flex items-center mb-2">
            <IconComponent className="w-[24px] h-[24px] mr-2 text-custom-blue" /> 
          </li>
        );
      })}
    </ul>
  </div>
);

export default PlansCard;
