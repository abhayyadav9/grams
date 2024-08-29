


import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "https://grams.onrender.com/api/v1/user/logout",
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 left-0 z-20 w-[16%] h-screen px-4 border-r border-gray-300 bg-white lg:w-20 md:w-16 sm:w-14">
      <div className="flex flex-col items-start">
        <h1 className="my-8 pl-3 text-xl font-bold lg:hidden">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-3 p-3 my-3 rounded-lg cursor-pointer hover:bg-gray-100 relative transition-all duration-200 ease-in-out"
            >
              {item.icon}
              <span className="hidden lg:block">{item.text}</span>
              {/* Notification popover to show liked users */}
              {item.text === "Notifications" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="absolute bottom-6 left-6 w-5 h-5 bg-red-600 hover:bg-red-600 rounded-full z-30" // Increased z-index of the button
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-64 p-4 bg-white rounded-md shadow-lg z-50" // Increased z-index of the PopoverContent
                    sideOffset={10} // Adds some offset to prevent it from being hidden
                  >
                    <div>
                      {likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="flex items-center gap-2 my-2"
                        >
                          <Avatar>
                            <AvatarImage src={notification.userDetails?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {notification.userDetails?.username}
                            </span>{" "}
                            liked your post
                          </p>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;




// const LeftSidebar = () => {
//   const { user } = useSelector((store) => store.auth);
//   const { likeNotification } = useSelector(
//     (store) => store.realTimeNotification
//   );

//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const dispatch = useDispatch();

//   const logoutHandler = async () => {
//     try {
//       const res = await axios.get("https://grams.onrender.com/api/v1/user/logout", {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         dispatch(setAuthUser(null));
//         dispatch(setSelectedPost(null));
//         dispatch(setPosts([]));

//         toast.success("Logout Success");
//         navigate("/login");
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };
//   const sidebarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <TrendingUp />, text: "Explore" },
//     { icon: <MessageCircle />, text: "Message" },
//     { icon: <Heart />, text: "Notifications" },
//     { icon: <Settings />, text: "Setting" },
//     { icon: <Plus />, text: "Create" },
//     {
//       icon: (
//         <Avatar className="w-6 h-6">
//           <AvatarImage src={user?.profilePicture} alt="@shadcn" />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//     {
//       icon: <LogOut />, // Always visible, regardless of screen size
//       text: "Logout",
//     },
//   ];

//   const sidebarHandler = (textType) => {
//     if (textType === "Logout") {
//       logoutHandler();
//     } else if (textType === "Create") {
//       setOpen(true);
//     } else if (textType === "Profile") {
//       navigate(`/profile/${user._id}`);
//     } else if (textType === "Home") {
//       navigate("/");
//     } else if (textType === "Message") {
//       navigate("/chat");
//     }
//   };

//   return (
//     <>
//       <div className="fixed top-0 left-0 w-[60px] md:w-[80px] xl:w-[240px] h-screen bg-white shadow-lg border-r border-gray-300 flex flex-col items-center md:items-start p-4 transition-all">
//         <div className="mb-5">
//           <h1 className=" text-xl font-bold text-gray-900">Logo</h1>
//         </div>
//         <div className="space-y-7 xl:w-[240px] space-y-3">
//           {sidebarItems.map((item, index) => (
//             <div
//               onClick={() => sidebarHandler(item.text)}
//               key={index}
//               className="flex items-center gap-2 md:gap-3 xl:gap-4 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-all"
//             >
//               {item.icon}
//               <span className="hidden md:block xl:block text-sm md:text-base font-medium">
//                 {item.text}
//               </span>




//               {item.text === "Notifications" && likeNotification.length > 0 && (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       size="icon"
//                       className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
//                     >
//                       {likeNotification.length}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent>
//                     <div>
//                       {likeNotification.length === 0 ? (
//                         <p>No new notification</p>
//                       ) : (
//                         likeNotification.map((notification) => {
//                           return (
//                             <div
//                               key={notification.userId}
//                               className="flex items-center gap-2 my-2"
//                             >
//                               <Avatar>
//                                 <AvatarImage
//                                   src={notification.userDetails?.profilePicture}
//                                 />
//                                 <AvatarFallback>CN</AvatarFallback>
//                               </Avatar>
//                               <p className="text-sm">
//                                 <span className="font-bold">
//                                   {notification.userDetails?.username}
//                                 </span>{" "}
//                                 liked your post
//                               </p>
//                             </div>
//                           );
//                         })
//                       )}
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               )}
             
             
//             </div>
//           ))}
//         </div>
//       </div>
//       <CreatePost open={open} setOpen={setOpen} />
//     </>
//   );
// };

// export default LeftSidebar;
























//   import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
// import React, { useState } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { setAuthUser } from '@/redux/authSlice'
// import CreatePost from './CreatePost'
// // import { setPosts, setSelectedPost } from '@/redux/postSlice'
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
// import { Button } from './ui/button'

// const LeftSidebar = () => {
//     const navigate = useNavigate();
//     const { user } = useSelector(store => store.auth);
//     // const { likeNotification } = useSelector(store => store.realTimeNotification);
//     const dispatch = useDispatch();
//     const [open, setOpen] = useState(false);

//     const logoutHandler = async () => {
//         try {
//             const res = await axios.get('https://instaclone-g9h5.onrender.com/api/v1/user/logout', { withCredentials: true });
//             if (res.data.success) {
//                 dispatch(setAuthUser(null));
//                 // dispatch(setSelectedPost(null));
//                 // dispatch(setPosts([]));
//                 navigate("/login");
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             toast.error(error.response.data.message);
//         }
//     }

//     const sidebarHandler = (textType) => {
//         if (textType === 'Logout') {
//             logoutHandler();
//         } else if (textType === "Create") {
//             setOpen(true);
//         } else if (textType === "Profile") {
//             navigate(`/profile/${user?._id}`);
//         } else if (textType === "Home") {
//             navigate("/");
//         } else if (textType === 'Messages') {
//             navigate("/chat");
//         }
//     }

//     const sidebarItems = [
//         { icon: <Home />, text: "Home" },
//         { icon: <Search />, text: "Search" },
//         { icon: <TrendingUp />, text: "Explore" },
//         { icon: <MessageCircle />, text: "Messages" },
//         { icon: <Heart />, text: "Notifications" },
//         { icon: <PlusSquare />, text: "Create" },
//         {
//             icon: (
//                 <Avatar className='w-6 h-6'>
//                     <AvatarImage src={user?.profilePicture} alt="@shadcn" />
//                     <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//             ),
//             text: "Profile"
//         },
//         { icon: <LogOut />, text: "Logout" },
//     ]
//     return (
//         <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
//             <div className='flex flex-col'>
//                 <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
//                 <div>
//                     {
//                         sidebarItems.map((item, index) => {
//                             return (
//                                 <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
//                                     {item.icon}
//                                     <span>{item.text}</span>
//                                     {
//                                         // item.text === "Notifications" && likeNotification.length > 0 && (
//                                         (
//                                             <Popover>
//                                                 <PopoverTrigger asChild>
//                                                     <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
//                                                 </PopoverTrigger>
//                                                 <PopoverContent>
//                                                     <div>
//                                                         {
//                                                             // likeNotification.length === 0 ? (<p>No new notification</p>) : (
//                                                             //     likeNotification.map((notification) => {
//                                                             //         return (
//                                                             //             <div key={notification.userId} className='flex items-center gap-2 my-2'>
//                                                             //                 <Avatar>
//                                                             //                     <AvatarImage src={notification.userDetails?.profilePicture} />
//                                                             //                     <AvatarFallback>CN</AvatarFallback>
//                                                             //                 </Avatar>
//                                                             //                 <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
//                                                             //             </div>
//                                                             //         )
//                                                             //     })
//                                                             // )
//                                                         }
//                                                     </div>
//                                                 </PopoverContent>
//                                             </Popover>
//                                         )
//                                     }
//                                 </div>
//                             )
//                         })
//                     }
//                 </div>
//             </div>

//             <CreatePost open={open} setOpen={setOpen} />

//         </div>
//     )
// }

// export default LeftSidebar

//   import {
//     Heart,
//     Home,
//     LogOut,
//     MessageCircle,
//     Plus,
//     Search,
//     Settings,
//     TrendingUp,
//   } from "lucide-react";
//   import React from "react";
//   import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

//   const sidebarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <TrendingUp />, text: "Explore" },
//     { icon: <MessageCircle />, text: "Message" },
//     { icon: <Heart />, text: "Notifications" },
//     { icon: <Settings />, text: "Setting" },
//     { icon: <Plus />, text: "Create" },
//     {
//       icon: (
//         <Avatar className="w-6 h-6">
//           <AvatarImage src="https://github.com/shadcn.png" />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//     { icon: <LogOut />, text: "Logout" },
//   ];

//   const LeftSidebar = () => {
//     return (
//       <div className="fixed top-8 z-10 left-0 px-4 border-r border-gray-400 w-[16%] h-screen">
//         <div className="flex flex-col items-center">
//           <h1 className="mb-6 text-lg font-bold">Logo</h1>

//           <div className="w-full">
//             {sidebarItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex items-center gap-3 my-3 p-2 relative hover:bg-gray-200 rounded-lg cursor-pointer group"
//               >
//                 {item.icon}
//                 <span className="hidden group-hover:block lg:block text-sm font-medium lg:ml-2">
//                   {item.text}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   export default LeftSidebar;

//   import {
//     Heart,
//     Home,
//     LogOut,
//     MessageCircle,
//     Plus,
//     Search,
//     Settings,
//     TrendingUp,
//   } from "lucide-react";
//   import React from "react";
//   import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

//   const sidebarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <TrendingUp />, text: "Explore" },
//     { icon: <MessageCircle />, text: "Message" },
//     { icon: <Heart />, text: "Notifications" },
//     { icon: <Settings />, text: "Setting" },
//     { icon: <Plus />, text: "Create" },
//     {
//       icon: (
//         <Avatar className="w-6 h-6">
//           <AvatarImage src="https://github.com/shadcn.png" />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//     { icon: <LogOut />, text: "Logout" },
//   ];

//   const LeftSidebar = () => {
//     return (
//       <div className="fixed top-8 z-10 left-0 px-4 border-r border-gray-400 w-[16%] h-screen">
//         <div className="flex flex-col items-center">
//           <h1 className="mb-6 text-lg font-bold">Logo</h1>

//           <div className="w-full">
//             {sidebarItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex items-center gap-3 my-3 p-2 relative hover:bg-gray-200 rounded-lg cursor-pointer group"
//               >
//                 {item.icon}
//                 <span className="hidden group-hover:block lg:block text-sm font-medium lg:ml-2">
//                   {item.text}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   export default LeftSidebar;
