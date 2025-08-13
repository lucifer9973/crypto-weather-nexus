import React from 'react';
import { toast } from 'react-hot-toast';

interface NotificationToastProps {
  type: 'price_alert' | 'weather_alert' | 'general';
  message: string;
}

export const showNotificationToast = ({ type, message }: NotificationToastProps) => {
  const icon = type === 'price_alert' 
    ? '💰' 
    : type === 'weather_alert' 
    ? '🌦️' 
    : 'ℹ️';
  
  toast(
    <div className="flex items-start gap-2">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="font-medium">
          {type === 'price_alert' 
            ? 'Price Alert' 
            : type === 'weather_alert' 
            ? 'Weather Alert' 
            : 'Notification'}
        </p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>,
    {
      duration: 5000,
      position: 'top-right',
      className: 'bg-background border border-border',
    }
  );
};