
import * as fs from 'fs';

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

// Directory for storing analytics data files
const ANALYTICS_DIR = './analytics_data';

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
  
  // Save data to local file system (would be done server-side in a real app)
  try {
    saveAnalyticsToFile(eventData);
  } catch (error) {
    console.error('Failed to save analytics to file:', error);
  }
};

// Save analytics data to CSV file
const saveAnalyticsToFile = (data: Record<string, any>): void => {
  // In a real application, this would be done on the server side
  // This is a simulation of how it would work
  
  // Create user-specific file
  const userDirPath = `${ANALYTICS_DIR}/${data.userId}`;
  const filePath = `${userDirPath}/interactions.csv`;
  
  // This would create the directory if it doesn't exist
  // fs.mkdirSync(userDirPath, { recursive: true });
  
  // Format data for CSV
  const csvLine = `${data.timestamp},${data.action},${JSON.stringify(data)}\n`;
  
  // Append to CSV file
  // fs.appendFileSync(filePath, csvLine);
  
  // Save chat queries separately if this is a search action
  if (data.action === 'search' && data.query) {
    const chatFilePath = `${userDirPath}/chat_queries.txt`;
    const chatLine = `${data.timestamp}: ${data.query}\n`;
    // fs.appendFileSync(chatFilePath, chatLine);
  }
  
  // Store the analytics data in localStorage for demo purposes
  // In a real app, this would be sent to a server
  const analyticsData = JSON.parse(localStorage.getItem('thai_cookery_analytics') || '[]');
  analyticsData.push(data);
  localStorage.setItem('thai_cookery_analytics', JSON.stringify(analyticsData));
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

// Get analytics data (for demonstration purposes)
export const getAnalyticsData = (): any[] => {
  return JSON.parse(localStorage.getItem('thai_cookery_analytics') || '[]');
};

// Export analytics data to CSV
export const exportAnalyticsToCSV = (): string => {
  const analyticsData = getAnalyticsData();
  
  if (analyticsData.length === 0) {
    return '';
  }
  
  // Get all possible headers from the data
  const allKeys = new Set<string>();
  analyticsData.forEach(data => {
    Object.keys(data).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  analyticsData.forEach(data => {
    const row = headers.map(header => {
      const value = data[header] || '';
      return typeof value === 'object' ? JSON.stringify(value).replace(/,/g, ';') : value;
    });
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
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
  getUserId,
  getAnalyticsData,
  exportAnalyticsToCSV
};
