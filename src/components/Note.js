import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import { red, green } from "@mui/material/colors";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./styles/Note.css";

// Prop Types validation
Note.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func, // Optional function
  onEdit: PropTypes.func, // Optional function
  isSortable: PropTypes.bool, // Optional prop to enable/disable sorting
};

function Note({ id, title, content, onDelete, onEdit, isSortable = true }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isSortable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isSortable ? "grab" : "default",
    touchAction: "none", // Important for mobile
    visibility: isDragging ? "hidden" : "visible", // Hide the original note when dragging
  };

  // Custom event handler to prevent dragging when clicking inside the buttons
  const handlePointerDown = (event) => {
    const target = event.target;
    // Prevent dragging if clicking inside a button
    if (target.closest("button")) {
      event.stopPropagation();
    } else if (listeners.onPointerDown) {
      listeners.onPointerDown(event); // Call the original listener if not a button
    }
  };

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} // Use original listeners for other events
      onPointerDown={isSortable ? handlePointerDown : undefined} // Override pointer down
    >
      <div className="note">
        <h1>{title}</h1>
        <p>{content}</p>
        <Fab
          data-testid={`delete-note-button${id}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          sx={fabDeleteStyle}
        >
          <DeleteIcon />
        </Fab>
        <Fab
          data-testid={`edit-note-button${id}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }}
          sx={fabEditStyle}
        >
          <EditIcon />
        </Fab>
      </div>
    </div>
  );
}

export default Note;