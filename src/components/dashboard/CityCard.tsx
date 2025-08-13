'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { City } from '@/lib/api/openWeather';

interface CityCardProps {
  city: City;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, isFavorite, onFavoriteToggle }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {city.name}, {city.country}
          <Button variant="ghost" size="icon" onClick={onFavoriteToggle}>
            {isFavorite ? '★' : '☆'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Additional weather data can be displayed here */}
        <p>Weather data will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default CityCard;
