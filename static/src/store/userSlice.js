import { createSlice } from "@reduxjs/toolkit";

// Helper function to get stored username from local storage
const getStoredUsername = () => {
  try {
    const storedUsername = localStorage.getItem("username");
    console.log(storedUsername)
    return storedUsername ? storedUsername : null;
  } catch (error) {
    console.error("Failed to parse username from localStorage:", error);
    return null;
  }
};

// Initial state with stored username if available
const initialState = {
  username: getStoredUsername(),
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
        state.username = action.payload.username;
      localStorage.setItem("username", JSON.stringify(action.payload.username));
    },

    clearUser(state) {
      state.username = null;
      state.gamesPlayed = 0;
      state.wins = 0;
      state.losses = 0;
      state.draws = 0;
      localStorage.removeItem("username");
    },
    updateGameStats(state, action) {
      state.gamesPlayed += 1;
      if (action.payload.result === "win") {
        state.wins += 1;
      } else if (action.payload.result === "lose") {
        state.losses += 1;
      } else if (action.payload.result === "draw") {
        state.draws += 1;
      }
    }    
  },
});

export const { setUser, clearUser, updateGameStats } = userSlice.actions;
export default userSlice.reducer;
