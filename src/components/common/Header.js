import NotesIcon from "@mui/icons-material/Notes";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserProfile } from "../../context/UserContext";
import { logout } from "../../services/Api.js";
import Search from "./Search.js";
import "./styles/Header.css";

// Prop Types validation
Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

function Header({ onSearch }) {
  let navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserProfile();
  const isNotesPage = location.pathname === "/notes";
  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header>
      <h1>
        <img src="/img/sticky-notes.png" alt="Sticky Notes" />
        Stickies <NotesIcon />
      </h1>

      {isNotesPage ? (
        <>
          <div className="search-container">
            <Search onSearch={onSearch} />
          </div>
          <div className="header-button-container">
            <h2 className="user">{user?.email}</h2>
            <button
              data-testid="logout-button"
              type="submit"
              className="submit-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      ) : null}
    </header>
  );
}

export default Header;
