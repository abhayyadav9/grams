import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPosts";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";

export const Home = () => {
  useGetAllPost();
  useGetSuggestedUser();

  return (
    <>
      <div className="flex">
        <div className="flex-grow">
          <Feed />
          <div>
            <Outlet />
          </div>
        </div>
        {/* Sidebar hidden on screens smaller than 'md' (768px) */}
        <div className="hidden md:block">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};
