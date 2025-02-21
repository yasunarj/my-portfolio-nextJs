import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  purchasedGames: string[];
}

const initialState: GameState = {
  purchasedGames: []
};

const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    purchaseGame: (state, action: PayloadAction<string>) => {
      if (!state.purchasedGames.includes(action.payload)) {
        state.purchasedGames.push(action.payload);
      }
    }
  }
});

export const { purchaseGame } = gameSlice.actions;
export default gameSlice.reducer; 