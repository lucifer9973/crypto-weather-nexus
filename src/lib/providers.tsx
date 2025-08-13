'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useWebSocket } from '@/hooks/useWebSocket';

export function Providers({ children }: { children: React.ReactNode }) {
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
