import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface FavoritesState {
  cities: FavoriteCity[];
  cryptos: string[]; // store crypto IDs here
}

const initialState: FavoritesState = {
  cities: [],
  cryptos: []
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleCityFavorite: (state, action: PayloadAction<FavoriteCity>) => {
      const index = state.cities.findIndex(city => city.id === action.payload.id);
      if (index >= 0) {
        state.cities.splice(index, 1);
      } else {
        state.cities.push(action.payload);
      }
    },
    toggleCryptoFavorite: (state, action: PayloadAction<string>) => {
      const index = state.cryptos.indexOf(action.payload);
      if (index >= 0) {
        state.cryptos.splice(index, 1);
      } else {
        state.cryptos.push(action.payload);
      }
    }
  }
});

export const { toggleCityFavorite, toggleCryptoFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
