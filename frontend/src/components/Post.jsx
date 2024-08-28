import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import React, { useState } from "react";
import { DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { VscVerifiedFilled } from "react-icons/vsc";

import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postlike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comment);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeOrDislikeHandler = async () => {
    // Optimistically update the UI
    const newLikedState = !liked;
    setLiked(newLikedState);
    setPostLike(newLikedState ? postlike + 1 : postlike - 1);

    // Update the Redux store immediately
    const updatedPostData = posts.map((p) =>
      p._id === post._id
        ? {
            ...p,
            likes: newLikedState
              ? [...p.likes, user._id]
              : p.likes.filter((id) => id !== user._id),
          }
        : p
    );
    dispatch(setPosts(updatedPostData));

    try {
      const action = newLikedState ? "like" : "dislike";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        // Revert the UI and Redux store update if the server action fails
        setLiked(!newLikedState);
        setPostLike(newLikedState ? postlike - 1 : postlike + 1);

        const revertedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: !newLikedState
                  ? [...p.likes, user._id]
                  : p.likes.filter((id) => id !== user._id),
              }
            : p
        );
        dispatch(setPosts(revertedPostData));
      }
    } catch (error) {
      console.log(error);
      // Revert the UI and Redux store update if the request fails
      setLiked(!newLikedState);
      setPostLike(newLikedState ? postlike - 1 : postlike + 1);

      const revertedPostData = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: !newLikedState
                ? [...p.likes, user._id]
                : p.likes.filter((id) => id !== user._id),
            }
          : p
      );
      dispatch(setPosts(revertedPostData));
    }
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
        // Update the comments locally
        const updatedCommentData = [...post.comments, res.data.comment]; // Assuming 'res.data.comment' is the newly added comment

        // Update the post in the Redux store
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedCommentData,
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        // Clear the input field after posting the comment
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

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const bookMarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={post.author?.profilePicture}
              className="h-full w-full rounded-full object-cover"
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center  mb-5">
            <h1 className="text-sm font-semibold">{post.author?.username}</h1>

            <VscVerifiedFilled className="text-blue-500 mt-1 text-sm" />

            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}

            {/* <span className="text-xs text-gray-500">Author</span> */}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-600" />
          </DialogTrigger>
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-items-center bg-white p-4 rounded-lg shadow-lg z-50">
            {
              post?.author?._id != user?._id &&
              <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            }
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-red-600 font-bold"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full h-auto object-cover max-h-80"
        src={post.image}
        alt="post_img"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={24}
              onClick={likeOrDislikeHandler}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={24}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            size={24}
            onClick={() => {
              dispatch(setSelectedPost(post)), setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send size={24} className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          onClick={bookMarkHandler}
          size={24}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <span className="font-medium block mb-2">{postlike} likes</span>
      <p className="text-sm">
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {post.comments.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post)), setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-500"
        >
          View all {post.comments.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} post={post} />
      <div className="flex items-center justify-between mt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full p-2 bg-gray-100 rounded-md"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer ml-2 font-semibold"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
