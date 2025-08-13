import { useEffect, useState } from 'react';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    const connect = () => {
      try {
        const socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin,ripple,cardano,solana,polkadot');
        
        socket.onopen = () => {
          setIsConnected(true);
          setReconnectAttempt(0);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setPrices((prevPrices) => ({ ...prevPrices, ...data }));
          } catch (error) {
            console.warn('WebSocket message parsing error:', error);
          }
        };

        socket.onerror = (error) => {
          console.warn('WebSocket error:', error);
        };

        socket.onclose = () => {
          setIsConnected(false);
          // Attempt to reconnect with exponential backoff
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
          setTimeout(() => {
            setReconnectAttempt(prev => prev + 1);
            connect();
          }, timeout);
        };

        return socket;
      } catch (error) {
        console.warn('WebSocket initialization failed:', error);
        setIsConnected(false);
        return null;
      }
    };

    const socket = connect();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [reconnectAttempt]);

  return { isConnected, prices };
}