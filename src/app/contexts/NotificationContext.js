'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const showNotification = (title, options = {}) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  };

  const scheduleDailyNotification = () => {
    if (permission === 'granted') {
      // Schedule notification for tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      const timeUntilNotification = tomorrow.getTime() - Date.now();
      
      setTimeout(() => {
        showNotification('SSC Exam Reminder', {
          body: 'Time to check your exam schedule and add today\'s to-do list!',
          tag: 'daily-reminder'
        });
      }, timeUntilNotification);
    }
  };

  const showExamCountdown = (examName, daysLeft) => {
    if (permission === 'granted') {
      showNotification('Exam Countdown', {
        body: `${daysLeft} days left for ${examName}`,
        tag: 'exam-countdown'
      });
    }
  };

  const value = {
    permission,
    requestPermission,
    showNotification,
    scheduleDailyNotification,
    showExamCountdown
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
} 