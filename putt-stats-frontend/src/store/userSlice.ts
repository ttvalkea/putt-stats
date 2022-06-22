import { createSlice } from "@reduxjs/toolkit";
import { user } from "../types";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [] as user[],
  },
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUsers } = userSlice.actions;

export default userSlice.reducer;
