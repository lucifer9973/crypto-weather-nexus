'use client';

import { WeatherSection } from '@/components/dashboard/WeatherSection';
import { CryptoSection } from '@/components/dashboard/CryptoSection';
import { NewsSection } from '@/components/dashboard/NewsSection';

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">CryptoWeather Nexus</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WeatherSection />
        </div>
        <div className="lg:col-span-1">
          <CryptoSection />
        </div>
        <div className="lg:col-span-1">
          <NewsSection />
        </div>
      </div>
    </main>
  );
}
