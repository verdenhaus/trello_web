import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boardsSlice';

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
});