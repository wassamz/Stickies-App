const config = {
  baseURL: process.env.REACT_APP_API_URL,
  otpLength: parseInt(process.env.REACT_APP_OTP_LENGTH) || 4,
  otpRetryAttempts: parseInt(process.env.REACT_APP_OTP_RETRY_ATTEMPTS) || 4,

  noteTitleMaxLength: process.env.REACT_APP_NOTE_TITLE_MAX_LENGTH || 15,
  noteContentMaxLength: process.env.REACT_APP_NOTE_CONTENT_MAX_LENGTH || 200,
};

export default config;
