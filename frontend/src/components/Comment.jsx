import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar
          className="w-8 h-8 rounded-full "
          style={{ borderRadius: "2 px solid red" }}
        >
          <AvatarImage
            src={comment?.author?.profilePicture}
            className="h-full w-full rounded-full object-cover"
          />
          <AvatarFallback className="rounded-full">CN</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm mb-5 mr-3">
          {comment?.author?.username}
          <span className="font-normal mx-3 pl-1">{comment?.text}</span>
        </h1>
      </div>
      <hr />
    </div>
  );
};

export default Comment;
