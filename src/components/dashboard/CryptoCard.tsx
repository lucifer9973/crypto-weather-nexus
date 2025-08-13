'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Import Link
import { CryptoData } from '@/lib/api/coinGecko';

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ id, name, symbol, price, change24h, isFavorite, onFavoriteToggle }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link href={`/crypto/${id}`} className="hover:underline">
              {name} ({symbol.toUpperCase()})
            </Link>
            <Button variant="ghost" size="icon" onClick={onFavoriteToggle} className="ml-auto">
              {isFavorite ? '★' : '☆'}
            </Button>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm ${change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;
