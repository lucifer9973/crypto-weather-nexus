import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export const fetchWeather = async (city: string) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  return response.data;
};