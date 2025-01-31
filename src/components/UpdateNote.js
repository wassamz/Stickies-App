import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH } from "../util/note";

// Prop Types validation
UpdateNote.propTypes = {
  note: PropTypes.object.isRequired,
  saveUpdate: PropTypes.func.isRequired,
};
function UpdateNote(props) {
  const [updateNote, setUpdateNote] = useState(props.note);
  const [rows, setRows] = useState(1);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

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
  const reducedRowSize = 1;
  const expandedRowSize = 3;

  function handleChange(event) {
    let { value, name } = event.target;
    if (value) setRows(expandedRowSize);
    else setRows(reducedRowSize);
    if (value === "") value = " ";
    setUpdateNote((prevState) => ({ ...prevState, [name]: value }));
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Zoom in={!!updateNote?.content}>
          <input
            name="title"
            data-testid="update-note-title"
            placeholder="Title"
            onChange={handleChange}
            value={updateNote?.title}
            maxLength={MAX_TITLE_LENGTH}
          />
        </Zoom>

        <textarea
          name="content"
          data-testid="update-note-content"
          placeholder="Take a note..."
          rows={rows}
          onChange={handleChange}
          value={updateNote?.content}
          maxLength={MAX_CONTENT_LENGTH}
          ref={contentRef}
        />
        <Zoom
          in={!!updateNote?.content}
          style={{ transitionDelay: updateNote?.content ? "300ms" : "0ms" }}
        >
          <Fab
            data-testid="update-save-button"
            onClick={() => {
              if (updateNote?.content) {
                props.saveUpdate(updateNote);
              }
            }}
            sx={fabStyle}
          >
            <SaveAltIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default UpdateNote;
