import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  image: string;
}

export interface MarketChartData {
  prices: [number, number][]; // [timestamp, price]
}

export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3/' }),
  endpoints: (builder) => ({
    getTopCryptos: builder.query<CryptoData[], void>({
      query: () => 'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    }),
    getCryptoMarketChart: builder.query<MarketChartData, { id: string; days: number }>({
      query: ({ id, days }) => `coins/${id}/market_chart?vs_currency=usd&days=${days}`
    })
  })
});

export const { useGetTopCryptosQuery, useGetCryptoMarketChartQuery } = coinGeckoApi;
