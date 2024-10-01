import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const apiName = "culo-api";
const apiVer = "v1";
const apiProtocol1 = "https";
const apiAddress1 = "resentekaizen280-001-site1.etempurl.com";
const apiPort1 = "";
const apiProtocol2 = "https";
const apiAddress2 = "45.58.159.46";
const apiPort2 = "";

// Primary and Secondary API URLs
const primaryBaseUrl = `${apiProtocol1}://${apiAddress1}${apiPort1}/${apiName}/${apiVer}`;
const secondaryBaseUrl = `${apiProtocol2}://${apiAddress2}${apiPort2}/${apiName}/${apiVer}`;

// Create an Axios instance with primary and fallback options
const api = axios.create({
  baseURL: primaryBaseUrl, // Base URL of your primary API
});

// Function to retry with secondary base URL on failure
const retryWithSecondaryBaseUrl = (error: AxiosError) => {
  const originalBaseUrl = error.config?.baseURL;

  // Check if the request failed due to network error or server unavailability
  if (
    !error.response || // Network error (no response received)
    error.code === "ECONNABORTED" || // Timeout
    (error.response && error.response.status >= 500) // Server error (5xx)
  ) {
    // If not already using the secondary base URL, retry with it
    if (error.config && error.config.baseURL !== secondaryBaseUrl) {
      error.config.baseURL = secondaryBaseUrl; // Switch to secondary base URL
      return axios.request(error.config); // Retry the request
    }
  }

  // If no retry or already using the secondary base URL, reject the error
  return Promise.reject(error);
};

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Basic MTExOTY5MTM6NjAtZGF5ZnJlZXRyaWFs, Bearer ${token}`;
    } else {
      config.headers.Authorization = `Basic MTExOTY5MTM6NjAtZGF5ZnJlZXRyaWFs`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors and retry with secondary base URL
api.interceptors.response.use(
  (response) => response,
  (error) => retryWithSecondaryBaseUrl(error)
);

export default api;
