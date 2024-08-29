import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import MainLayout from "./components/ui/MainLayout";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoute from "./components/ProtectedRoute";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoute><MainLayout /></ProtectedRoute> ,
    children: [
      {
        path: "/",
        element:<ProtectedRoute><Home /></ProtectedRoute> ,
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoute><Profile/></ProtectedRoute>,
      },
      {
        path: "/account/edit",
        element: <ProtectedRoute><EditProfile/></ProtectedRoute>,
      },
      {
        path: "/chat",
        element:<ProtectedRoute><ChatPage/></ProtectedRoute> ,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("https://grams.onrender.com", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // Listening to events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notifications) => {
        dispatch(setLikeNotification(notifications));
      });

      return () => {
        socketio.off("getOnlineUsers"); // Cleanup event listener
        socketio.close(); // Close the socket connection
        dispatch(setSocket(null));
      };
    } else {
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
