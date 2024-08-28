import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  // Ensure suggestedUsers is an array before mapping
  if (!Array.isArray(suggestedUsers)) {
    return <div>No suggestions available.</div>;
  }

  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4 text-sm">
        <h1 className="font-semibold text-gray-500">
          Suggested For You
          <span className="font-medium cursor-pointer text-blue-500 ml-2">
            See All
          </span>
        </h1>
      </div>
      {suggestedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between mb-4 gap-4"
        >
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user?.profilePicture}
                  className="w-8 h-8 rounded-full object-cover"
                  alt={`${user?.username || "User"} Avatar`}
                />
                <AvatarFallback className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <Link
                to={`/profile/${user?._id}`}
                className="font-medium text-sm text-gray-800"
              >
                {user?.username || "Unknown User"}
              </Link>
              <span className="text-xs text-gray-500">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <button className="text-blue-500 text-sm font-medium">Follow</button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;
