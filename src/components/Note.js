import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import { red, green } from "@mui/material/colors";
import "./styles/Note.css";

// Prop Types validation
Note.propTypes = {
  title: PropTypes.string.isRequired, 
  content: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, 
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

function Note(props) {
  const fabEditStyle = {
    color: green[100],
    bgcolor: green[300],
    "&:hover": {
      bgcolor: green[800],
    },
  };
  const fabDeleteStyle = {
    color: red[100],
    bgcolor: red[300],
    "&:hover": {
      bgcolor: red[800],
    },
  };

  return (
    <div className="note">
      <h1>{props?.title}</h1>
      <p>{props?.content}</p>
      <Fab
        data-testid={`delete-note-button${props.id}`}
        onClick={() => {
          props.onDelete(props.id);
        }}
        sx={fabDeleteStyle}
      >
        <DeleteIcon />
      </Fab>
      <Fab
        data-testid={`edit-note-button${props.id}`}
        onClick={() => {
          props.onEdit(props.id);
        }}
        sx={fabEditStyle}
      >
        <EditIcon />
      </Fab>
    </div>
  );
}

export default Note;
