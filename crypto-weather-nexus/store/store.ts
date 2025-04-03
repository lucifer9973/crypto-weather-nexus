import { configureStore } from '@reduxjs/toolkit';
import { cryptoSlice } from '../features/crypto/cryptoSlice';
import { weatherSlice } from '../features/weather/weatherSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoSlice.reducer,
    weather: weatherSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;