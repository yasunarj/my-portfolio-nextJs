import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JankenState {
  authId: string | null;
  guideMessage: string;
  cpuCard: CardType | null;
  point: number;
  othelloGamePermission: boolean;
  blackJackGamePermission: boolean;
  computerHand: number | null;
  playerHand: number | null;
  isShowingResult: boolean;
}

const initialState: JankenState = {
  authId: null,
  guideMessage: "",
  cpuCard: null,
  point: 0,
  othelloGamePermission: false,
  blackJackGamePermission: false,
  computerHand: null,
  playerHand: null,
  isShowingResult: false,
};

const jankenSlice = createSlice({
  name: "janken",
  initialState,
  reducers: {
    setAuthId: (state, { payload }) => {
      state.authId = payload;
    },
    clearAuthId: (state) => {
      state.authId = null;
    },
    setPoint: (state, { payload }) => {
      state.point = payload;
    },
    setCpuCard: (state) => {
      const choices: CardType[] = ["rock", "scissors", "paper"];
      const decisionCard = choices[Math.floor(Math.random() * choices.length)];
      state.cpuCard = decisionCard;
    },
    setGuideMessage: (state, { payload }) => {
      state.guideMessage = payload;
    },
    incrementPoint: (state, { payload }) => {
      state.point += payload;
    },
    decrementPoint: (state, { payload }) => {
      state.point -= payload;
    },
    decreasePoint: (state, { payload }) => {
      state.point = Math.max(0, state.point - payload);
    },
    setPlayerHand: (state, action: PayloadAction<number>) => {
      state.playerHand = action.payload;
    },
    setComputerHand: (state, action: PayloadAction<number>) => {
      state.computerHand = action.payload;
      state.isShowingResult = true;
    },
    resetGame: (state) => {
      state.guideMessage = "";
      state.cpuCard = null;
      state.computerHand = null;
      state.playerHand = null;
      state.isShowingResult = false;
    },
  },
});

export const {
  setAuthId,
  clearAuthId,
  setPoint,
  setCpuCard,
  setGuideMessage,
  incrementPoint,
  decrementPoint,
  decreasePoint,
  setPlayerHand,
  setComputerHand,
  resetGame,
} = jankenSlice.actions;
export default jankenSlice;
