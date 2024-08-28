import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification(state, action) {
      // Adding a 'like' notification
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload); // Push new like notification into the array
      } 
      // Removing a 'like' notification when it is 'disliked'
      else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
  },
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
