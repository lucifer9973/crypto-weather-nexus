import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface WeatherResponse {
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    uvi: number;
    dew_point: number;
    clouds: number;
    wind_deg: number;
    wind_gust?: number;
    sunrise: number;
    sunset: number;
    visibility: number;
    pressure: number;
  };
  hourly: {
    dt: number;
    temp: number;
  }[];
  daily: {
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  timezone: string;
  timezone_offset: number;
}

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface ForecastListItem {
  dt: number;
  main: { temp: number; pressure: number; humidity: number; };
  weather: { id: number; main: string; description: string; icon: string; }[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  sys: { sunrise: number; sunset: number };
  visibility: number;
}

export const openWeatherApi = createApi({
  reducerPath: 'openWeatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openweathermap.org/data/2.5' }),
  endpoints: (builder) => ({
    getWeatherByCoords: builder.query<WeatherResponse, { lat: number; lon: number }>({
      async queryFn({ lat, lon }) {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) {
          return { error: { status: 400, data: 'OpenWeather API key is not configured' } };
        }

        try {
          // Current weather
          const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );
          const currentData: ForecastListItem & { name: string } = await currentRes.json();

          // 5-day / 3-hour forecast
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );
          const forecastData: { list: ForecastListItem[] } = await forecastRes.json();

          const hourly = forecastData.list.slice(0, 8).map((f) => ({
            dt: f.dt,
            temp: f.main.temp,
          }));

          const dailyMap: Record<string, { temps: number[]; weather: ForecastListItem['weather'] }> = {};
          forecastData.list.forEach((f) => {
            const date = new Date(f.dt * 1000).toISOString().split('T')[0];
            if (!dailyMap[date]) {
              dailyMap[date] = { temps: [], weather: [] };
            }
            dailyMap[date].temps.push(f.main.temp);
            dailyMap[date].weather.push(f.weather[0]);
          });

          const daily = Object.entries(dailyMap).map(([date, data]) => ({
            dt: Math.floor(new Date(date).getTime() / 1000),
            temp: {
              min: Math.min(...data.temps),
              max: Math.max(...data.temps),
            },
            weather: [data.weather[0]],
          }));

          const result: WeatherResponse = {
            current: {
              dt: currentData.dt,
              temp: currentData.main.temp,
              feels_like: currentData.main.feels_like,
              humidity: currentData.main.humidity,
              wind_speed: currentData.wind.speed,
              weather: currentData.weather,
              uvi: 0,
              dew_point: 0,
              clouds: currentData.clouds.all,
              wind_deg: currentData.wind.deg,
              wind_gust: currentData.wind.gust,
              sunrise: currentData.sys.sunrise,
              sunset: currentData.sys.sunset,
              visibility: currentData.visibility,
              pressure: currentData.main.pressure,
            },
            hourly,
            daily,
            timezone: currentData.name,
            timezone_offset: 0,
          };

          return { data: result };
        } catch (err) {
          return { error: { status: 500, data: (err as Error).message } };
        }
      },
    }),
  }),
});

export const { useGetWeatherByCoordsQuery } = openWeatherApi;
