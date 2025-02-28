
// Unique identifier for the current user session
let userId: string;

// Generate or retrieve a unique user ID
const getUserId = (): string => {
  if (!userId) {
    // Check if userId exists in localStorage
    const storedId = localStorage.getItem('thai_cookery_user_id');
    
    if (storedId) {
      userId = storedId;
    } else {
      // Generate a new UUID
      userId = generateUUID();
      localStorage.setItem('thai_cookery_user_id', userId);
    }
  }
  
  return userId;
};

// Simple UUID generator
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Track user interactions
export const trackUserInteraction = (
  action: string, 
  data: Record<string, any>
): void => {
  const userId = getUserId();
  const timestamp = new Date().toISOString();
  const sessionId = getSessionId();
  const menuId = getMenuId();
  
  const eventData = {
    userId,
    menuId,
    sessionId,
    action,
    timestamp,
    ...data,
    userAgent: navigator.userAgent,
    language: navigator.language,
    referrer: document.referrer,
    screenSize: `${window.innerWidth}x${window.innerHeight}`
  };
  
  // Log to console during development
  console.log('User interaction:', eventData);
  
  // Send data to backend API
  sendAnalyticsData(eventData);
};

// Get or create a unique session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('thai_cookery_session_id');
  
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('thai_cookery_session_id', sessionId);
    
    // Record session start
    trackSessionStart(sessionId);
  }
  
  return sessionId;
};

// Get a unique ID for this menu instance
const getMenuId = (): string => {
  let menuId = localStorage.getItem('thai_cookery_menu_id');
  
  if (!menuId) {
    menuId = `menu_${Date.now()}`;
    localStorage.setItem('thai_cookery_menu_id', menuId);
  }
  
  return menuId;
};

// Track session start
const trackSessionStart = (sessionId: string): void => {
  const data = {
    userId: getUserId(),
    sessionId,
    timestamp: new Date().toISOString(),
    action: 'session_start',
    userAgent: navigator.userAgent,
    language: navigator.language,
    referrer: document.referrer,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  // Send session start data to backend
  sendAnalyticsData(data);
};

// Send analytics data to the backend
const sendAnalyticsData = async (data: Record<string, any>): Promise<void> => {
  // This would normally be your backend API endpoint
  // const API_URL = 'https://api.example.com/analytics';
  
  // For now, we'll just log to console and store in localStorage for demo purposes
  try {
    // Store in localStorage for demonstration purposes
    const analyticsData = JSON.parse(localStorage.getItem('thai_cookery_analytics') || '[]');
    analyticsData.push(data);
    localStorage.setItem('thai_cookery_analytics', JSON.stringify(analyticsData));
    
    // In a real application, you'd send this to your backend:
    /*
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    */
  } catch (error) {
    console.error('Failed to send analytics data:', error);
  }
};

// Automatically track when the user leaves the page
window.addEventListener('beforeunload', () => {
  trackUserInteraction('page_exit', {
    timeSpent: (performance.now() / 1000).toFixed(2) + 's'
  });
});

// Export functions for direct use
export default {
  trackUserInteraction,
  getUserId
};
