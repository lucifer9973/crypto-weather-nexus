'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetCryptoNewsQuery, useGetWeatherNewsQuery } from '@/lib/api/newsData';
import { NewsArticle } from '@/lib/api/newsData';
import Image from 'next/image';

type NewsCategory = 'crypto' | 'weather';

interface NewsFilter {
  category: string;
  label: string;
}

const CRYPTO_FILTERS: NewsFilter[] = [
  { category: 'bitcoin', label: 'Bitcoin' },
  { category: 'ethereum', label: 'Ethereum' },
  { category: 'blockchain', label: 'Blockchain' },
  { category: 'defi', label: 'DeFi' },
  { category: 'nft', label: 'NFTs' },
];

const WEATHER_FILTERS: NewsFilter[] = [
  { category: 'climate', label: 'Climate' },
  { category: 'storm', label: 'Storms' },
  { category: 'hurricane', label: 'Hurricanes' },
  { category: 'forecast', label: 'Forecasts' },
  { category: 'temperature', label: 'Temperature' },
];

// List of known whitelisted domains for next/image
const SAFE_IMAGE_DOMAINS = [
  'siliconcanals.com',
  'hackernoon.imgix.net',
  // Add more if needed
];

export function NewsSection() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('crypto');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const {
    data: cryptoNews,
    isLoading: isCryptoLoading,
    error: cryptoError,
    refetch: refetchCrypto,
  } = useGetCryptoNewsQuery();

  const {
    data: weatherNews,
    isLoading: isWeatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useGetWeatherNewsQuery();

  const isLoading = activeCategory === 'crypto' ? isCryptoLoading : isWeatherLoading;
  const error = activeCategory === 'crypto' ? cryptoError : weatherError;

  const cryptoNewsResults = cryptoNews?.results || [];
  const weatherNewsResults = weatherNews?.results || [];

  const allNews = activeCategory === 'crypto' ? cryptoNewsResults : weatherNewsResults;

  const news = selectedFilter
    ? allNews.filter(
        (article) =>
          article.title.toLowerCase().includes(selectedFilter.toLowerCase()) ||
          article.description.toLowerCase().includes(selectedFilter.toLowerCase())
      )
    : allNews;

  const currentFilters = activeCategory === 'crypto' ? CRYPTO_FILTERS : WEATHER_FILTERS;

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const renderNewsImage = (url: string, alt: string) => {
    try {
      const hostname = new URL(url).hostname;
      if (SAFE_IMAGE_DOMAINS.includes(hostname)) {
        return (
          <Image
            src={url}
            alt={alt}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        );
      } else {
        return (
          <img
            src={url}
            alt={alt}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        );
      }
    } catch {
      return null;
    }
  };

  return (
    <Card className="col-span-12 lg:col-span-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Latest News</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant={activeCategory === 'crypto' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveCategory('crypto');
                setSelectedFilter('');
                refetchCrypto();
              }}
            >
              Crypto
            </Button>
            <Button
              variant={activeCategory === 'weather' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveCategory('weather');
                setSelectedFilter('');
                refetchWeather();
              }}
            >
              Weather
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <select
            className="w-full p-2 border rounded-md bg-card text-foreground"
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All {activeCategory} news</option>
            {currentFilters.map((filter) => (
              <option key={filter.category} value={filter.category}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border-b pb-4 last:border-0">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load news data
          </div>
        ) : news.length > 0 ? (
          news.map((article: NewsArticle) => (
            <div key={article.article_id} className="border-b pb-4 last:border-0">
              <div className="flex gap-3">
                {article.image_url && (
                  <div className="flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden">
                    {renderNewsImage(article.image_url, article.title)}
                  </div>
                )}
                <div className="flex-1">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    <h3 className="font-medium mb-1">{article.title}</h3>
                  </a>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {article.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {article.source_id} •{' '}
                      {new Date(article.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No news available</div>
        )}
      </CardContent>
    </Card>
  );
}
