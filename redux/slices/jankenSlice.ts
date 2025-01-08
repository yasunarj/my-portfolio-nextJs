import { createSlice } from "@reduxjs/toolkit";

interface JankenState {
  authId: string | null;
  guideMessage: string;
  cpuCard: CardType | null;
  point: number;
  othelloGamePermission: boolean;
  blackJackGamePermission: boolean;
}

const initialState: JankenState = {
  authId: null,
  guideMessage: "",
  cpuCard: null,
  point: 0,
  othelloGamePermission: false,
  blackJackGamePermission: false,
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
    resetGame: (state) => {
      state.guideMessage = "";
      state.cpuCard = null;
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
  resetGame,
} = jankenSlice.actions;
export default jankenSlice;
