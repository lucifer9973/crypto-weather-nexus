import { configureStore } from '@reduxjs/toolkit';
import { openWeatherApi } from '@/lib/api/openWeather';
import { coinGeckoApi } from '@/lib/api/coinGecko';
import { newsDataApi } from '@/lib/api/newsData';
import favoritesReducer from './slices/favoritesSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    [openWeatherApi.reducerPath]: openWeatherApi.reducer,
    [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
    [newsDataApi.reducerPath]: newsDataApi.reducer,
    favorites: favoritesReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(openWeatherApi.middleware)
      .concat(coinGeckoApi.middleware)
      .concat(newsDataApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;