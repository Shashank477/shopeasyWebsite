import moengage from "@moengage/web-sdk";

// Get configuration from environment variables
const MOENGAGE_APP_ID = process.env.REACT_APP_MOENGAGE_APP_ID;
const MOENGAGE_DATA_CENTER = process.env.REACT_APP_MOENGAGE_DATA_CENTER;
const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

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
    useLatest: true,// Always use latest version of Web SDK
    service_worker: {
      path: '/serviceworker.js'
    }
  };


  // Complete push token generation flow:
(async function() {
  try {
    console.log('Current permission state:', window.Moengage.getPermissionState());
    console.log('Browser permission:', Notification.permission);
    
    // Call web push
    const result = window.Moengage.callWebPush();
    console.log('Web push result:', result);
    
    // Wait 3 seconds then check storage
    setTimeout(() => {
      console.log('✅ Check your MoEngage storage logs now!');
    }, 3000);
    
  } catch (error) {
    console.error('Error:', error);
  }
})();


  try {
    moengage.initialize(config);
    console.log('MoEngage initialized successfully with config:', config);

  } catch (error) {
    console.error('Error initializing MoEngage:', error);
  }
};

export default moengage;