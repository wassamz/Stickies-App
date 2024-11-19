import { AxiosError } from "axios";

const checkAuthLoader = function () {
  const token = getToken();
  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return null;
};

const getToken = function () {
  return localStorage.getItem("token");
};
const setToken = function (token) {
  localStorage.setItem("token", token);
};

const clearTokens = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

const reject = (error, originalRequest, statusCode, redirect = true) => {
  const axiosError = new AxiosError(error, {
    response: {
      status: statusCode,
      config: originalRequest,
      data: { redirect: redirect },
    },
  });
  return Promise.reject(axiosError);
};

export { checkAuthLoader, getToken, setToken, clearTokens, reject };
