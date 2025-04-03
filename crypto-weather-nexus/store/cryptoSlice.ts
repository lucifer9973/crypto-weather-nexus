import axios from 'axios';

export const fetchCryptoData = async (id: string) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${id}`
  );
  return response.data;
};