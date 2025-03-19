const validName = (name) => {
  const regex = /^[A-Za-z]+\s*[A-Za-z]+$/; // At least 2 alphabetic characters, optional spaces between
  return regex.test(name);
};

//check if email is a valid email address
const validEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

//check if password meets the requirements
// minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const validPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const errorReason = {
  NAME_INVALID: "Name must contain at least 2 alphabetic characters.",
  PASSWORD_INVALID:
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  EMAIL_INVALID: "Please enter a valid email address.",
  LOGIN_FAILED:
    "Login failed. Please check your email and password and try again.",
  OTP_INVALID: "Invalid code provided. Please try again.",
  OTP_EXPIRED: "Your 4 digit code has expired. Please try again.",
};

export { errorReason, validEmail, validName, validPassword };
