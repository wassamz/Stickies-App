import PropTypes from "prop-types";
import { forwardRef } from "react";
import "./styles/Info.css";

const Info = forwardRef(({ message }, ref) => (
  <output ref={ref} className="info-panel">
    {message}
  </output>
));
Info.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Info;
