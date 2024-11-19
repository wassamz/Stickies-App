import PropTypes from "prop-types";
import "./styles/Error.css";

// Prop Types validation
Error.propTypes = {
  message: PropTypes.string.isRequired,
};

function Error(props) {
  return (
    <div className="error-panel">
      <p>{props.message}</p>
    </div>
  );
}

export default Error;
