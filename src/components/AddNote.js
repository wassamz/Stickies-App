import { useState } from "react";
import PropTypes from "prop-types";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { green } from "@mui/material/colors";

// Prop Types validation
AddNote.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

function AddNote(props) {
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });

  const [rows, setRows] = useState(1);
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

  function handleChange(e) {
    const { value, name } = e.target;
    if (value) setRows(expandedRowSize);
    else setRows(reducedRowSize);

    setNewNote((prevState) => ({ ...prevState, [name]: value }));
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {rows > 1 && (
          <Zoom in={!!newNote.content}>
            <input
              data-testid="add-note-title"
              name="title"
              placeholder="Optional Title"
              onChange={handleChange}
              value={newNote.title}
              maxLength="15"
            />
          </Zoom>
        )}
        <textarea
          name="content"
          data-testid="add-note-content"
          placeholder="Add a note..."
          rows={rows}
          onChange={handleChange}
          value={newNote.content}
        />
        <Zoom
          in={!!newNote.content}
          style={{ transitionDelay: newNote.content ? "300ms" : "0ms" }}
        >
          <Fab
            data-testid="add-note-button"
            onClick={() => {
              if (newNote.content) {
                props.onAdd(newNote);
                setRows(1);
                setNewNote({ title: "", content: "", });
              }
            }}
            sx={fabStyle}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default AddNote;
