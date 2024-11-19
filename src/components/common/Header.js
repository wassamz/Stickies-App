import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import NotesIcon from "@mui/icons-material/Notes";
import Search from "./Search.js";
import { getToken, clearTokens } from "../../util/auth.js";
import "./styles/Header.css";

// Prop Types validation
Header.propTypes = {
  onSearch: PropTypes.func.isRequired, 
  userData: PropTypes.object.isRequired,
};

function Header({ onSearch, userData }) {
  let navigate = useNavigate();

  function handleLogout() {
    clearTokens();
    navigate("/", { replace: true });
  }

  return (
    <header>
      <h1>
        <img src="/img/sticky-notes.png" alt="Sticky Notes" height="100" width="100"></img>Stickies <NotesIcon />
      </h1>
      {(String(onSearch) !== "() => {}")  ? <Search onSearch={onSearch}></Search> : <div></div>}
      {getToken() ? (
        <div className="button-container">
          <h2 className="user">{userData?.email}</h2>
          <button data-testid="logout-button" type="submit" className="submit-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </header>
  );
}

export default Header;
