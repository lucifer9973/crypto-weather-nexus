import { fetchWeather } from '@/services/weather';
import { fetchCryptoData } from '@/services/crypto';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { cities } = useAppSelector((state) => state.weather);
  const { cryptos } = useAppSelector((state) => state.crypto);

  useEffect(() => {
    // Fetch initial data
    ['new york', 'london', 'tokyo'].forEach((city) => {
      dispatch(fetchWeather(city));
    });
    ['bitcoin', 'ethereum', 'dogecoin'].forEach((id) => {
      dispatch(fetchCryptoData(id));
    });
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Weather Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Weather</h2>
        {cities.map((city) => (
          <div key={city.name}>{/* Display weather data */}</div>
        ))}
      </div>

      {/* Crypto Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Cryptocurrency</h2>
        {cryptos.map((crypto) => (
          <div key={crypto.id}>{/* Display crypto data */}</div>
        ))}
      </div>

      {/* News Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">News</h2>
        {/* Fetch news from NewsData.io */}
      </div>
    </div>
  );
}