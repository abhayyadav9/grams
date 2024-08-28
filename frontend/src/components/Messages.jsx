import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetAllMessage();
  useGetRTM();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage
              className="h-10 w-10 rounded-full"
              src={selectedUser?.profilePicture}
              alt="profilePicture"
            />
            <AvatarFallback className="bg-gray-300 text-gray-700">
              {selectedUser?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-4 font-semibold text-lg">
            {selectedUser?.username}
          </span>
        </div>
        <Link
          to={`/profile/${selectedUser?._id}`}
          className="ml-auto flex items-center"
        >
          <Button className="h-8 text-sm" variant="outline">
            View Profile
          </Button>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  msg.senderId === user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Messages;
