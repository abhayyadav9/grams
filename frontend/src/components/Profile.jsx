import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { AtSign, Badge, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile,user } = useSelector((store) => store.auth);

  // const { posts } = useSelector((store) => store.posts);

  const isLoggedInUserProfile =user?._id === userProfile?._id ;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col md:flex-row md:gap-10 items-center md:items-start">
        {/* Profile Picture Section */}
        <section className="flex-shrink-0 mb-6 md:mb-0">
  <div className="relative flex items-center justify-center">
    <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-gray-400 rounded-full overflow-hidden shadow-lg">
      <Avatar className="w-full h-full">
        <AvatarImage
          className="w-full h-full object-cover"
          src={userProfile?.profilePicture}
          alt={userProfile?.username || "Profile Picture"}
        />
        <AvatarFallback className="flex items-center justify-center w-full h-full text-2xl font-semibold text-gray-600 bg-gray-100">
          {userProfile?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  </div>
</section>


        {/* Profile Details Section */}
        <section className="flex-1">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                {userProfile?.username}
              </span>
              {isLoggedInUserProfile ? (
                <div className="flex gap-4">


                  <Link to="/account/edit">
                  <Button
                    variant="secondary"
                    className="h-8 text-sm bg-white border border-gray-300 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Button>
                  
                  </Link>
                  
                  <Button
                    variant="secondary"
                    className="h-8 text-sm bg-white border border-gray-300 hover:bg-gray-100"
                  >
                    View Archive
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-8 text-sm bg-white border border-gray-300 hover:bg-gray-100"
                  >
                    Ad Tools
                  </Button>
                </div>
              ) : isFollowing ? (
                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    className="h-8 text-sm bg-white border border-gray-300 hover:bg-gray-100"
                  >
                    Message
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-8 text-sm bg-white border border-gray-300 hover:bg-gray-100"
                  >
                    Unfollow
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  className="h-8 text-sm bg-[#0095F6] text-white border border-gray-300 hover:bg-[#3192d2]"
                >
                  Follow
                </Button>
              )}
            </div>

            <div className="flex gap-6 text-gray-800">
              <p>
                <span className="font-semibold">
                  {userProfile?.posts.length}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.followers.length}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.following.length}
                </span>{" "}
                following
              </p>
            </div>

            {/* Bio and Additional Details Section */}
            <div className="flex flex-col gap-2 mt-4">
              <span className="font-medium text-gray-900">
                {userProfile?.bio || "Bio here..."}
              </span>

              <div className="flex items-center gap-1 w-fit px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                <AtSign size={16} />
                <span className="text-sm">{userProfile?.username}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Posts Section */}
      <div className="border-t border-t-gray-200 mt-8">
        <div className="flex items-center justify-center gap-10">
          <span
            onClick={() => handleTabChange("posts")}
            className={`py-3 cursor-pointer ${
              activeTab === "posts" ? "font-bold" : ""
            }`}
          >
            Posts
          </span>
          <span
            onClick={() => handleTabChange("saved")}
            className={`py-3 cursor-pointer ${
              activeTab === "saved" ? "font-bold" : ""
            }`}
          >
            Saved
          </span>
          <span className="py-3 cursor-pointer">Reels</span>
          <span className="py-3 cursor-pointer">Tag</span>
        </div>

        {/* Posts Grid */}
        <div className="px-0 sm:px-4 md:px-8 lg:px-16 " style={{marginLeft:"20px"}}>
  <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 lg:gap-6">
    {displayedPosts?.map((post) => {
      return (
        <div key={post?._id} className="relative group cursor-pointer">
          <img
            src={post.image}
            alt="postimage"
            className="rounded-sm w-full aspect-square object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center text-white space-x-4">
              <button className="flex items-center gap-2 hover:text-gray-300">
                <Heart />
                <span>{post?.likes.length}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-gray-300">
                <MessageCircle />
                <span>{post?.comments.length}</span>
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

      </div>
    </div>
  );
};

export default Profile;
