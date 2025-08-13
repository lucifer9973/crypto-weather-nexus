import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image_url: string;
  source_id: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage: string;
}

export const newsDataApi = createApi({
  reducerPath: 'newsDataApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://newsdata.io/api/1' }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query<NewsResponse, void>({
      query: () => {
        const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
        if (!apiKey) {
          return {
            url: '',
            responseHandler: () =>
              Promise.reject(new Error('NewsData API key is not configured')),
          };
        }
        return {
          url: '/news',
          params: {
            apikey: apiKey,
            category: 'technology',
            q: 'crypto OR cryptocurrency OR bitcoin OR ethereum',
            language: 'en',
          },
        };
      },
    }),
    getWeatherNews: builder.query<NewsResponse, void>({
      query: () => {
        const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
        if (!apiKey) {
          return {
            url: '',
            responseHandler: () =>
              Promise.reject(new Error('NewsData API key is not configured')),
          };
        }
        return {
          url: '/news',
          params: {
            apikey: apiKey,
            q: 'weather OR climate OR temperature OR storm OR hurricane',
            language: 'en',
          },
        };
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery, useGetWeatherNewsQuery } = newsDataApi;
