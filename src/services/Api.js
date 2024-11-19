import axios from "axios";
import { clearTokens, getToken, reject, setToken } from "../util/auth";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.message))
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Handle cases where config is undefined
    api.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(new Error(error.message))
    );
    // Check if the request is for the refresh token endpoint
    if (originalRequest.url === "/users/refresh-token") {
      //Deleting tokens as refresh failed.
      clearTokens();

      // Set a custom error property to signal the need for redirect
      return reject("Unauthorized", originalRequest, 401, true);
    }
    /* If the error status is 401 and there is no originalRequest._retry flag,
       it means the token has expired and we need to refresh it */
    if (error.status === 401 && !originalRequest._retry) {
      console.log("Token expired, refreshing...");
      originalRequest._retry = true;
      //request new access token
      try {
        const response = await api.post(
          "/users/refresh-token",
          {},
          { withCredentials: true }
        );
        if (response.data && response.status !== 401) {
          const { accessToken } = response.data;
          setToken(accessToken);
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        //Error during token refresh, redirecting...
        clearTokens();
        // Set a custom property for the redirect
        return reject("Unauthorized", originalRequest, 401, true);
      }
    }
    return reject(error.message, originalRequest, error.status || 500, false);
  }
);

// API methods
const login = async (userData) => {
  if (!userData?.email || !userData?.password) {
    throw new Error("Invalid email or password");
  }
  try {
    const response = await api.post("/users/login", userData, {
      withCredentials: true,
    });
    const accessToken = response.data.accessToken;
    if (accessToken) {
      setToken(accessToken);
      return { status: "SUCCESS", message: "Login Successful" };
    }
  } catch (error) {
    //console.error("Unable to login: ", error);
    return { status: "ERROR", message: "Unable to login" };
  }
};

const signUp = async (userData) => {
  if (!userData?.email || !userData?.password) {
    throw new Error("Invalid email or password");
  }
  try {
    const response = await api.post("/users/signup", userData, {
      withCredentials: true,
    });
    const accessToken = response.data.accessToken;
    if (accessToken) {
      setToken(accessToken);
      return { status: "SUCCESS", message: "User Created" };
    }
  } catch (error) {
    return { status: "ERROR", message: "Unable to create user" };
  }
};

const notes = async () => {
  try {
    const response = await api.get("/notes");
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error(error);
  }
};

const createNote = async (note) => {
  try {
    const response = await api.post("/notes", note);
    if (response) return response.data;
  } catch (error) {
    console.error(
      "Error creating note:",
      error.response ? error.response.data : error.message
    );

    throw new Error(error);
  }
};

const updateNote = async (note) => {
  try {
    const response = await api.patch("/notes", note);
    if (response) return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const removeNote = async (id) => {
  try {
    const response = await api.delete(`/notes/${id}`);
    if (response) return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export { api, createNote, login, notes, removeNote, signUp, updateNote };
