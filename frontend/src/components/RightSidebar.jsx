import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const { post } = useSelector((store) => store.post);

  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-5 h-5">
            <AvatarImage
              src={user?.profilePicture}
              className=" w-6 h-6 rounded-full object-cover"
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>
              {user?.username.charAt(0).toUpperCase() +
                user?.username.slice(1).toLowerCase()}
            </Link>
          </h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "bio here"}
          </span>
        </div>
      </div>

      <SuggestedUser />
    </div>
  );
};

export default RightSidebar;
