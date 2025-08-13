import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationType = 'price_alert' | 'weather_alert' | 'general';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationPayload {
  type: NotificationType;
  message: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<NotificationPayload>) => {
      const { type, message } = action.payload;
      state.notifications.push({
        id: Date.now().toString(),
        type,
        message,
        timestamp: Date.now(),
        read: false,
      });
      
      // Keep only the latest 20 notifications
      if (state.notifications.length > 20) {
        state.notifications = state.notifications.slice(-20);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { showNotification, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;