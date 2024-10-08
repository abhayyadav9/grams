import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `https://grams.onrender.com/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, dispatch]); // Added `dispatch` to the dependency array
};

export default useGetUserProfile;
