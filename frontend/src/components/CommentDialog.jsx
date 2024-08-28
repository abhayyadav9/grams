import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen, post }) => {
  const [text, setText] = useState("");
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState(post?.comments || []);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };



  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedCommentData,
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        setComment(updatedCommentData);
        setText("");

        toast.success("Comment added successfully!");
      } else {
        toast.error(res.data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add comment";
      toast.error(errorMessage);
    }
  };

 
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={post?.image}
              alt="post_img"
              className="w-full h-auto max-h-[500px] object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            />
          </div>
          <div className="md:w-1/2 flex flex-col">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${post?.author?._id}`}>
                  <Avatar className="w-8 h-8 rounded-full">
                    <AvatarImage
                      src={post?.author?.profilePicture}
                      alt="profile image"
                      className="rounded-ful "
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/profile/${post?.author?._id}`}
                    className="font-semibold "
                  >
                    {post?.author?.username.charAt(0).toUpperCase() +
                      post?.author?.username.slice(1).toLowerCase()}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />

            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.map((commentItem) => (
                <Comment key={commentItem._id} comment={commentItem} />
              ))}
            </div>
            <div className="p-4 ">
              <div className="flex items-center gap-2 ">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300  p-2 rounded "
                />
                <Button
                  onClick={commentHandler}
                  disabled={!text.trim()}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
