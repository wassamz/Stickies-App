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
  PASSWORD_INVALID: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  EMAIL_INVALID: "Please enter a valid email address.",
  OTP_INVALID: "Invalid code provided. Please try again.",
  OTP_EXPIRED: "Your 4 digit code has expired. Please try again.",
}

export { validEmail, validPassword, errorReason };
