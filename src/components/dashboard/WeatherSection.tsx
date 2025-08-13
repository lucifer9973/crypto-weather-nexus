'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealTimeBadge } from '@/components/ui/real-time-badge';
import { useGetWeatherByCoordsQuery } from '@/lib/api/openWeather';
import { RootState } from '@/lib/store/store';
import { toggleCityFavorite } from '@/lib/store/slices/favoritesSlice';
import Link from 'next/link';
import { City } from '@/lib/api/openWeather';

const DEFAULT_CITIES: City[] = [
  { 
    id: '40.7128,-74.0060', 
    name: 'New York', 
    country: 'US', 
    lat: 40.7128, 
    lon: -74.0060 
  },
  { 
    id: '51.5074,-0.1278', 
    name: 'London', 
    country: 'GB', 
    lat: 51.5074, 
    lon: -0.1278 
  },
  { 
    id: '35.6762,139.6503', 
    name: 'Tokyo', 
    country: 'JP', 
    lat: 35.6762, 
    lon: 139.6503 
  },
  { 
    id: '48.8566,2.3522', 
    name: 'Paris', 
    country: 'FR', 
    lat: 48.8566, 
    lon: 2.3522 
  },
  { 
    id: '52.5200,13.4050', 
    name: 'Berlin', 
    country: 'DE', 
    lat: 52.5200, 
    lon: 13.4050 
  }
];

interface CityCardProps {
  city: City;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, isFavorite, onFavoriteToggle }) => {
  const { data: weatherData, isLoading, error } = useGetWeatherByCoordsQuery(
    { lat: city.lat, lon: city.lon }
  );

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-black dark:bg-gray-800">
        <div>
          <h3 className="font-medium">
            <Link 
              href={`/weather/${encodeURIComponent(city.name)}?lat=${city.lat}&lon=${city.lon}`}
              className="hover:underline"
            >
              {city.name}, {city.country}
            </Link>
          </h3>
          {!isLoading && !error && weatherData?.current?.weather?.[0]?.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {weatherData.current.weather[0].description}
            </p>
          )}
        </div>
        <button 
          onClick={onFavoriteToggle}
          className="text-xl"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-black rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="text-center py-2 text-red-500 text-sm">
            Failed to load weather
          </div>
        ) : weatherData?.current ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {weatherData.current.weather[0]?.icon && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`} 
                  alt={weatherData.current.weather[0].description} 
                  className="w-12 h-12"
                />
              )}
              <span className="text-2xl font-bold ml-2">
                {Math.round(weatherData.current.temp)}°C
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm">
                Feels like: {Math.round(weatherData.current.feels_like)}°C
              </p>
              <p className="text-sm">
                Humidity: {weatherData.current.humidity}%
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-gray-500 text-sm">
            Weather data unavailable
          </div>
        )}
      </div>
    </div>
  );
};

export function WeatherSection() {
  const dispatch = useDispatch();
  const favoriteCities = useSelector((state: RootState) => state.favorites.cities);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCities = searchTerm
    ? DEFAULT_CITIES.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        city.country.toLowerCase().includes(searchTerm.toLowerCase()))
    : DEFAULT_CITIES;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <RealTimeBadge pulse />
        <div className="mt-2 relative">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md bg-card text-foreground"
          />
          <svg 
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {filteredCities.length > 0 ? (
          filteredCities.map(city => (
            <CityCard
              key={city.id}
              city={city}
              isFavorite={favoriteCities.some(fav => fav.id === city.id)}
              onFavoriteToggle={() =>
                dispatch(toggleCityFavorite({ 
                  id: city.id, 
                  name: city.name, 
                  lat: city.lat, 
                  lon: city.lon 
                }))
              }
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No cities found matching "{searchTerm}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}