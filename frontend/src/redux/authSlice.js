import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser:null,
  },
  reducers: {
    // Action to set the authenticated user
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    // Action to set suggested users
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    // Action to set the user's profile
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    // Action to set the selected user
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
});

// Export the actions and reducer
export const { setAuthUser, setSuggestedUsers, setUserProfile,  setSelectedUser} = authSlice.actions;
export default authSlice.reducer;
