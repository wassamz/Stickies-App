import PropTypes from "prop-types";
import "./styles/Info.css";

// Prop Types validation
Info.propTypes = {
  message: PropTypes.string.isRequired,
};

function Info(props) {
  return (
    <div className="info-panel">
      <p>{props.message}</p>
    </div>
  );
}

export default Info;
