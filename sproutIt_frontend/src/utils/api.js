import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL.trim(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Only accept successful responses
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }

    // Add specific headers for DELETE requests
    if (config.method === "delete") {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    }

    // Log each request for debugging
    console.log("Making API request:", {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log("API Response received:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      config: {
        method: response.config.method,
        url: response.config.url,
        baseURL: response.config.baseURL,
      },
    });
    return response;
  },
  (error) => {
    // Log error responses
    console.error("API Error:", {
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      },
      request: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
    });
    return Promise.reject(error);
  }
);

export default api;
