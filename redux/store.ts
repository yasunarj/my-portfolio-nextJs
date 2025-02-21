import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import jankenSlice from "./slices/jankenSlice";
import gameReducer from './features/gameSlice';
import userReducer from './features/userSlice';
import { combineReducers } from 'redux';

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['janken', 'user', 'games'],
};

const rootReducer = {
  janken: jankenSlice.reducer,
  games: gameReducer,
  user: userReducer,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export default store;
