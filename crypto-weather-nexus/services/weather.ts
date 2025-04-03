import axios from 'axios'

export const fetchWeather = async (city: string) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
  )
  return res.data
}