import { useState } from "react";
import PropTypes from "prop-types";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import SearchIcon from "@mui/icons-material/Search";
import { green } from "@mui/material/colors";
import "./styles/Search.css";

// Prop Types validation
Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

function Search(props) {
  const [searchText, setSearchText] = useState("");

  const fabStyle = {
    position: "absolute",
    bottom: -9,
    right: -9,
    color: green[100],
    bgcolor: green[500],
    "&:hover": {
      bgcolor: green[800],
    },
  };

  function handleInputChange(e) {
    setSearchText(e.target.value);
    //default back to listing all notes if input is empty
    if (e.target.value === "") {
      props.onSearch("");
    }
  }

  const performSearch = (event) => {
    event.preventDefault(); // Prevent form submission from refreshing the page
    props.onSearch(searchText);
  };

  return (
    <div>
      <form data-testid="search-form" onSubmit={performSearch}>
        <input
          type="text"
          data-testid="search-note-content"
          placeholder="Search..."
          onChange={handleInputChange}
          value={searchText}
        />
        <Zoom
          in={!!searchText}
          style={{ transitionDelay: searchText ? "300ms" : "0ms" }}
        >
          <Fab data-testid="search-button" sx={fabStyle} type="submit">
            <SearchIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default Search;
