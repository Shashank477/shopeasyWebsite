import moengage from "@moengage/web-sdk";

// Get configuration from environment variables
const MOENGAGE_APP_ID = process.env.REACT_APP_MOENGAGE_APP_ID;
const MOENGAGE_DATA_CENTER = process.env.REACT_APP_MOENGAGE_DATA_CENTER || 'dc_3';
const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'development';

// Initialize MoEngage following official documentation
export const initializeMoEngage = () => {
  if (!MOENGAGE_APP_ID) {
    console.error('MoEngage App ID not found in environment variables');
    return;
  }

  const config = {
    app_id: MOENGAGE_APP_ID,
    cluster: MOENGAGE_DATA_CENTER,
    debug_logs: ENVIRONMENT, // 1 for TEST, 0 for LIVE/PRODUCTION
    useLatest: true, // Always use latest version of Web SDK
    service_worker: {
      path: '/serviceworker.js'
    }
  };

  try {
    moengage.initialize(config);
    console.log('MoEngage initialized successfully with config:', config);
    
    // Wait for MoEngage to fully initialize before calling web push
    setTimeout(() => {
      requestPushPermission();
    }, 3000);
    
  } catch (error) {
    console.error('Error initializing MoEngage:', error);
  }
};

// Separate function to handle push permissions
export const requestPushPermission = async () => {
  try {
    // Wait for MoEngage to be available on window
    if (!window.Moengage) {
      console.log('MoEngage not yet available on window, waiting...');
      setTimeout(requestPushPermission, 1000);
      return;
    }

    console.log('Current permission state:', window.Moengage.getPermissionState());
    console.log('Browser permission:', Notification.permission);
    
    // Only call web push if browser permission is granted
    if (Notification.permission === 'granted') {
      const result = window.Moengage.callWebPush();
      console.log('Web push result:', result);
      
      setTimeout(() => {
        console.log('✅ Check your MoEngage storage logs now!');
      }, 3000);
    } else {
      console.log('Browser permission not granted yet');
    }
    
  } catch (error) {
    console.error('Error in push permission:', error);
  }
};

// Function to manually trigger push permission (for buttons)
export const triggerPushPermission = async () => {
  try {
    // First get browser permission
    const permission = await Notification.requestPermission();
    console.log('Browser permission result:', permission);
    
    if (permission === 'granted' && window.Moengage) {
      window.Moengage.callWebPush();
      console.log('✅ Push permission granted and MoEngage called');
    }
  } catch (error) {
    console.error('Error triggering push permission:', error);
  }
};

export const trackEvent = (eventName, eventData = {}) => {
  try {
    moengage.track_event(eventName, eventData);
    console.log(`Event tracked: ${eventName}`, eventData);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export default moengage;