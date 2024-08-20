import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from "axios";
import Cookies from "js-cookie";

// API name and version
const apiName = "culo-api/v1/";

// Primary and Secondary API URLs
const primaryBaseUrl = "http://localhost:5155/" + apiName;
const secondaryBaseUrl = "http://192.168.1.8:5155/" + apiName; // Replace with your secondary server URL

// Create an Axios instance with primary and fallback options
const api: AxiosInstance = axios.create({
  baseURL: primaryBaseUrl, // Base URL of your primary API
});

// Function to retry with secondary base URL on failure
const retryWithSecondaryBaseUrl = (
  error: AxiosError
): Promise<AxiosResponse | void> => {
  // Check if the request failed due to network error or server unavailability
  if (
    !error.response ||
    error.code === "ECONNABORTED" ||
    (error.response && error.response.status >= 500)
  ) {
    // Retry the request with the secondary base URL
    if (error.config) {
      error.config.baseURL = secondaryBaseUrl;
      return axios.request(error.config);
    }
  }
  return Promise.reject(error);
};

// Add a request interceptor to include the session token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const sessionToken = Cookies.get("sessionToken");
    if (sessionToken) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Add a response interceptor to handle errors and retry with secondary base URL
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => retryWithSecondaryBaseUrl(error)
);

export default api;
