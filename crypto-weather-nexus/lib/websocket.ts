import { toast } from 'react-hot-toast';
import { store } from '@/app/store';
import { updateCryptoPrice } from '@/features/crypto/cryptoSlice';

export const setupWebSocket = () => {
  const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.bitcoin || data.ethereum) {
      store.dispatch(updateCryptoPrice(data));
      toast.success(`Price updated: ${JSON.stringify(data)}`);
    }
  };

  return ws;
};