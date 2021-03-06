// Modified from: https://markus.oberlehner.net/blog/using-the-google-maps-api-with-vue/

// Your personal API key.
// Get it here: https://console.cloud.google.com/google/maps-apis
const API_KEY = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
if(!API_KEY) throw new Error('Missing process.env.VUE_APP_GOOGLE_MAPS_API_KEY!');
const CALLBACK_NAME = 'gmapsCallback';

let initialized = !!(window as any).google;
let resolveInitPromise: any;
let rejectInitPromise: any;
// This promise handles the initialization
// status of the google maps script.
const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

export function init(): Promise<any> {
  // If Google Maps already is initialized
  // the `initPromise` should get resolved
  // eventually.
  if (initialized) return initPromise;

  initialized = true;
  // The callback function is called by
  // the Google Maps script if it is
  // successfully loaded.
  (window as any)[CALLBACK_NAME] = () => resolveInitPromise((window as any).google);

  // We inject a new script tag into
  // the `<head>` of our HTML to load
  // the Google Maps script.
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}`;
  script.onerror = rejectInitPromise;
  document.querySelector('head')!.appendChild(script);

  return initPromise;
}