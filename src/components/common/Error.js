import PropTypes from "prop-types";
import { forwardRef } from "react";
import "./styles/Error.css";

const Error = forwardRef(({ message }, ref) => (
  <output ref={ref} className="error-panel">
    {message}
  </output>
));

// Prop Types validation
Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;
