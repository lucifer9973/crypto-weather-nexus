'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealTimeBadge } from '@/components/ui/real-time-badge';
import { PriceChart } from '@/components/charts/PriceChart';
import { useGetTopCryptosQuery, useGetCryptoMarketChartQuery } from '@/lib/api/coinGecko';
import { RootState } from '@/lib/store/store';
import { toggleCryptoFavorite } from '@/lib/store/slices/favoritesSlice';
import { useWebSocket } from '@/hooks/useWebSocket';
import CryptoCard from './CryptoCard';

interface CryptoChartProps {
  cryptoId: string;
  name: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ cryptoId, name }) => {
  const { data: marketChartData, isLoading } = useGetCryptoMarketChartQuery({ id: cryptoId, days: 1 });
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  const formattedPriceData = marketChartData 
    ? marketChartData.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price
      }))
    : [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">{name}</h2>
      {formattedPriceData.length > 0 ? (
        <PriceChart data={formattedPriceData} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No price data available
        </div>
      )}
    </div>
  );
};

export function CryptoSection() {
  const dispatch = useDispatch();
  const favoriteCryptos = useSelector((state: RootState) => state.favorites.cryptos || []);
  const { data: cryptos, isLoading, error } = useGetTopCryptosQuery();
  const { isConnected } = useWebSocket();
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');

  // Set default to Bitcoin if it's in the list
  useEffect(() => {
    if (cryptos && cryptos.length > 0) {
      const bitcoinExists = cryptos.some(c => c.id === 'bitcoin');
      if (!bitcoinExists && !favoriteCryptos.includes(selectedCrypto)) {
        setSelectedCrypto(cryptos[0].id);
      }
    }
  }, [cryptos, favoriteCryptos, selectedCrypto]);

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrencies</CardTitle>
        <RealTimeBadge pulse={false} />
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
  
  if (error || !cryptos) return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrencies</CardTitle>
        <RealTimeBadge pulse={false} />
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-red-500">
          Failed to load cryptocurrency data
        </div>
      </CardContent>
    </Card>
  );

  const handleCryptoSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrypto(event.target.value);
  };

  const selectedCryptoData = selectedCrypto ? cryptos.find(crypto => crypto.id === selectedCrypto) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Cryptocurrencies</CardTitle>
          <RealTimeBadge pulse={isConnected} />
        </div>
        <div className="mt-2">
          <select 
            onChange={handleCryptoSelect} 
            value={selectedCrypto} 
            className="w-full p-2 bg-card text-foreground border border-gray-300 dark:border-gray-600 rounded-md"
          >
            {cryptos.map(crypto => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {selectedCrypto && selectedCryptoData ? (
          <CryptoChart 
            cryptoId={selectedCrypto} 
            name={`${selectedCryptoData.name} (${selectedCryptoData.symbol.toUpperCase()})`} 
          />
        ) : (
          favoriteCryptos.map((cryptoId) => {
            const crypto = cryptos.find(c => c.id === cryptoId);
            return (
              crypto && (
                <CryptoCard
                  key={cryptoId}
                  id={cryptoId}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  price={crypto.current_price}
                  change24h={crypto.price_change_percentage_24h}
                  isFavorite={favoriteCryptos.includes(cryptoId)}
                  onFavoriteToggle={() => dispatch(toggleCryptoFavorite(cryptoId))}
                />
              )
            );
          })
        )}
      </CardContent>
    </Card>
  );
}