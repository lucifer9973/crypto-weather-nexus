'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize WebSocket connection for real-time data
  const WebSocketInitializer = () => {
    useWebSocket();
    return null;
  };

  return (
    <Provider store={store}>
      <WebSocketInitializer />
      {children}
    </Provider>
  );
}