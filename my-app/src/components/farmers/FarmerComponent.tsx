import React from "react";
import profile_photo from "./profile_photo.jpg";
import { Link } from "react-router-dom";
import { Dot } from "lucide-react";

const FarmerComponent = ({
  id,
  first_name,
  last_name,
  location,
  total_farm_area,
  crops,
  specialization,
  image,
}: {
  id: string;
  first_name: string;
  last_name: string;
  location: string;
  total_farm_area: string;
  crops: Array<string>;
  specialization: string | null;
}) => {
  console.log(image);
  return (
    <Link
      to={`/farmers/${id}/`}
      className="border border-gray-300 rounded-md background-white flex flex-col overflow-hidden justify-center items-center"
    >
      <div className="relative w-full">
        <img src={image} alt="" className="w-full h-full" />
        {/* <span className='absolute top-2 left-2 text-gray-300'>Top Farmer</span> */}
      </div>
      <div className="py-4 px-4 w-full">
        <div className="flex items-center mb-2">
          <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm text-green-500">Available</span>
        </div>
        <div className="font-bold text-xl mb-1">{`${first_name} ${last_name}`}</div>
        <p className="text-gray-700 text-base">{location}</p>
        <div className="flex -translate-x-2 text-sm font-bold text-gray-500 items-center">
          <Dot />
          Expertise:
          {specialization}
        </div>
      </div>
    </Link>
  );
};

export default FarmerComponent;
