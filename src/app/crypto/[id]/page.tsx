'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useGetWeatherByCoordsQuery } from '@/lib/api/openWeather';
import { TemperatureChart } from '@/components/charts/TemperatureChart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCityFavorite, FavoriteCity } from '@/lib/store/slices/favoritesSlice';
import { RootState } from '@/lib/store/store';
import Link from 'next/link';

export default function WeatherDetailPage() {
  const { city } = useParams<{ city: string }>();
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.cities);

  const cityId = `${city}:${lat}:${lon}`;
  const isFavorite = favorites.some(fav => fav.id === cityId);

  const { data: weatherData, isLoading } = useGetWeatherByCoordsQuery(
    { lat: Number(lat), lon: Number(lon) },
    { skip: !lat || !lon }
  );

  const handleToggleFavorite = () => {
    if (weatherData && lat && lon) {
      dispatch(toggleCityFavorite({
        id: cityId,
        name: city,
        lat: Number(lat),
        lon: Number(lon)
      } as FavoriteCity));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!weatherData || !lat || !lon) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Weather data not found</h1>
        <p>Please make sure you have provided valid coordinates.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  const hourlyTemperatureData = weatherData.hourly.slice(0, 24).map(hour => ({
    time: new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: Math.round(hour.temp)
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {weatherData.current.weather[0].icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
              alt={weatherData.current.weather[0].description}
              className="w-16 h-16"
            />
          )}
          <h1 className="text-3xl font-bold">{city}</h1>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleToggleFavorite}
            variant={isFavorite ? 'default' : 'outline'}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold">
                {Math.round(weatherData.current.temp)}°C
              </div>
              <div className="text-lg capitalize mt-2">
                {weatherData.current.weather[0].description}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-gray-500">Feels Like</p>
                <p className="font-medium">{Math.round(weatherData.current.feels_like)}°C</p>
              </div>
              <div>
                <p className="text-gray-500">Humidity</p>
                <p className="font-medium">{weatherData.current.humidity}%</p>
              </div>
              <div>
                <p className="text-gray-500">Wind Speed</p>
                <p className="font-medium">{Math.round(weatherData.current.wind_speed)} m/s</p>
              </div>
              <div>
                <p className="text-gray-500">UV Index</p>
                <p className="font-medium">{Math.round(weatherData.current.uvi)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">24-Hour Forecast</h2>
          <TemperatureChart data={hourlyTemperatureData} color="#3b82f6" height={300} />
        </Card>
      </div>

      {/* Remaining cards unchanged */}
    </div>
  );
}
