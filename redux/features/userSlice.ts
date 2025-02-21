import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  coins: number;
}

const initialState: UserState = {
  coins: 500  // 初期コイン
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addCoins: (state, action: PayloadAction<number>) => {
      state.coins += action.payload;
    },
    removeCoins: (state, action: PayloadAction<number>) => {
      state.coins = Math.max(0, state.coins - action.payload);
    }
  }
});

export const { addCoins, removeCoins } = userSlice.actions;
export default userSlice.reducer; 