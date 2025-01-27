import { AxiosError } from "axios";

//API Helpers
const statusCode = { SUCCESS: "SUCCESS", ERROR: "ERROR" };
const authFormType = {
  LOGIN: 0,
  SIGNUP: 1,
  RESET: 2,
};

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

const reject = (error, originalRequest, status, redirect = true) => {
  const axiosError = new AxiosError(error, {
    response: {
      status: status,
      config: originalRequest,
      data: { redirect: redirect },
    },
  });
  return Promise.reject(axiosError);
};

//UI Helpers

const showForm = (setFormData, toggleForm) => (formType) => {
  setFormData((prevFormData) => {
    const updatedFormData = {
      ...prevFormData,
      toggleForm: formType,
    };
    toggleForm(updatedFormData);
    return updatedFormData;
  });
};

export {
  authFormType,
  checkAuthLoader,
  clearTokens,
  getToken,
  reject,
  setToken,
  showForm,
  statusCode,
};
