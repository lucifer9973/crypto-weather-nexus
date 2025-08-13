'use client';

import React, { useEffect } from 'react';
import { useGetWeatherByCoordsQuery } from '@/lib/api/openWeather';
import { useGetCryptoNewsQuery } from '@/lib/api/newsData';

export function ConfigChecker() {
  // Test weather API
  const { error: weatherError } = useGetWeatherByCoordsQuery(
    { lat: 40.7128, lon: -74.0060 }
  );
  
  // Test news API
  const { error: newsError } = useGetCryptoNewsQuery();

  useEffect(() => {
    if (weatherError) {
      console.error('Weather API error:', weatherError);
      // Only show alert if we're in development mode
      if (process.env.NODE_ENV === 'development') {
        alert('Weather API configuration issue. Please check your API key.');
      }
    }
    
    if (newsError) {
      console.error('News API error:', newsError);
      if (process.env.NODE_ENV === 'development') {
        alert('News API configuration issue. Please check your API key.');
      }
    }
  }, [weatherError, newsError]);

  return null;
}