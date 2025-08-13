import { AppDispatch } from '../store/store';
import { showNotification } from '../store/slices/notificationSlice';

interface CryptoPrices {
  [key: string]: number;
}

let lastPrices: CryptoPrices = {};
let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const baseReconnectDelay = 3000;

const calculatePercentageChange = (coin: string, currentPrice: number): number => {
  if (!lastPrices[coin]) return 0;
  
  const previousPrice = lastPrices[coin];
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  return parseFloat(change.toFixed(2));
};

const connectWebSocket = (dispatch: AppDispatch) => {
  // Close existing connection if any
  if (ws) {
    ws.close();
    ws = null;
  }

  try {
    ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin,ripple,cardano,solana,polkadot');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts = 0;
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        Object.entries(data).forEach(([coin, price]) => {
          const numericPrice = Number(price);
          const change = calculatePercentageChange(coin, numericPrice);
          
          if (lastPrices[coin] && Math.abs(change) > 2) {
            dispatch(showNotification({
              type: 'price_alert',
              message: `${coin} ${change > 0 ? '↑' : '↓'} ${Math.abs(change)}%`,
            }));
          }
          
          lastPrices[coin] = numericPrice;
        });
      } catch (error) {
        console.log('Error processing WebSocket message:', error);
      }
    };
    
    ws.onclose = (event) => {
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts - 1);
        console.log(`Reconnecting in ${delay/1000} seconds (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
        
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => connectWebSocket(dispatch), delay);
      } else {
        console.log('Max reconnect attempts reached. Stopping WebSocket connection.');
      }
    };
    
    ws.onerror = (error) => {
      console.log('WebSocket error:', error);
    };
  } catch (error) {
    console.log('WebSocket initialization failed:', error);
    
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts - 1);
      
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => connectWebSocket(dispatch), delay);
    }
  }
};

export const setupWebSocket = (dispatch: AppDispatch) => {
  connectWebSocket(dispatch);
  
  // Simulated weather alerts
  const weatherInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      const cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin'];
      const alerts = ['Severe weather warning', 'Heavy rainfall expected', 'High temperature alert', 'Strong winds forecast', 'Storm approaching'];
      
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      
      dispatch(showNotification({
        type: 'weather_alert',
        message: `${randomAlert} in ${randomCity}`,
      }));
    }
  }, 60000); // Every minute
  
  return () => {
    if (ws) {
      ws.close();
      ws = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    clearInterval(weatherInterval);
  };
};

export const getCryptoPrices = (): CryptoPrices => {
  return { ...lastPrices };
};