import axios from "axios";
import config from "../config/config.js";
import {
  clearTokens,
  getToken,
  reject,
  setToken,
  statusCode,
} from "../util/auth";

// Create an Axios instance
const api = axios.create({
  baseURL: config.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.message))
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
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
          const accessToken = response.headers.get("Authorization");
          setToken(accessToken); //save the new token
          // Retry the original request with the new token
          originalRequest.headers.Authorization = accessToken;
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
    clearTokens();
    const response = await api.post("/users/login", userData, {
      withCredentials: true,
    });
    const accessToken = response.headers.get("Authorization");

    if (accessToken) {
      setToken(accessToken);
      return { status: statusCode.SUCCESS, message: "Login Successful" };
    }
  } catch (error) {
    return { status: statusCode.ERROR, message: "Unable to login" };
  }
};

const logout = async () => {
  clearTokens();
  try {
    await api.post(
      "/users/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return { status: statusCode.SUCCESS, message: "Logout Successful" };
  } catch (error) {
    return { status: statusCode.ERROR, message: "Unable to logout" };
  }
};

const signUp = async (name, email, password, otp) => {
  if (!name || !email || !password || !otp) {
    throw new Error(
      "Please check your name, email, password, and OTP and try again."
    );
  }
  try {
    const response = await api.post(
      "/users/signup",
      { name: name, email: email, password: password, otp: otp },
      {
        withCredentials: true,
      }
    );
    const accessToken = response.headers.get("Authorization");

    if (accessToken) {
      setToken(accessToken);
      return { status: statusCode.SUCCESS, message: "User Created" };
    } else return { status: statusCode.ERROR, message: response.data.error };
  } catch (error) {
    return { status: statusCode.ERROR, message: "Sign Up Unsuccessful" };
  }
};

const checkEmail = async (email) => {
  if (!email) {
    throw new Error("Please provide an email address");
  }
  try {
    //check if password already exists, otherwise allow the user to continue
    const response = await api.post("/users/checkEmail", { email: email });
    if (response.status === 200)
      return {
        status: statusCode.SUCCESS,
        message: "OTP has been sent your email.",
      };
    else
      return {
        status: statusCode.ERROR,
        message: "User already exists. Please login or reset your password.",
      };
  } catch (error) {
    return {
      status: statusCode.ERROR,
      message: "User already exists. Please login or reset your password.",
    };
  }
};

const forgotPassword = async (email) => {
  if (!email) {
    throw new Error("Please provide an email address");
  }
  try {
    const response = await api.post("/users/forgotPassword", { email: email });
    if (response.status === 200)
      return {
        status: statusCode.SUCCESS,
        message: "OTP has been sent to email on file.",
      };
    else throw new Error("Forgot Password unsuccessful");
  } catch (error) {
    return { status: statusCode.ERROR, message: "Unable to send OTP. Please try again later." };
  }
};

const resetPassword = async (email, password, otp) => {
  if (!email || !password || !otp) {
    throw new Error(
      "Unable to reset password, please check your email, password, and OTP"
    );
  }
  try {
    const response = await api.post("/users/resetPassword", {
      email: email,
      newPassword: password,
      otp: Number(otp),
    });
    if (response.status === 200)
      return { status: statusCode.SUCCESS, message: "Password has been reset" };
    else throw new Error("Error while attempting to reset password");
  } catch (error) {
    return { status: statusCode.ERROR, message: "Unable to reset password" };
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

const updateNoteOrder = async (notesToUpdate) => {
  const response = await api.patch("/notes/updateOrder", notesToUpdate);
  if (response) return response.data;
};

const removeNote = async (id) => {
  try {
    const response = await api.delete(`/notes/${id}`);
    if (response) return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  api,
  checkEmail,
  createNote,
  forgotPassword,
  login,
  logout,
  notes,
  removeNote,
  resetPassword,
  signUp,
  updateNote,
  updateNoteOrder,
};
