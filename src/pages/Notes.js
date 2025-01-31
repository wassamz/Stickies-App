import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddNote from "../components/AddNote";
import Error from "../components/common/Error";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Info from "../components/common/Info";
import Note from "../components/Note"; // Import the combined Note component
import UpdateNote from "../components/UpdateNote";
import {
  createNote,
  notes,
  removeNote,
  updateNote,
  updateNoteOrder,
} from "../services/Api";

function Notes() {
  const [noteList, setNoteList] = useState([]);
  const [activeId, setActiveId] = useState(null); // Track the actively dragged note
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [editNote, setEditNote] = useState({
    key: "",
    _id: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await notes();
        data.sort((a, b) => a.order - b.order); // Ensure correct order
        setNoteList(data);
      } catch (err) {
        setError({ message: "Failed to fetch notes" });
        navigate("/"); // return to auth page
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const addNote = async (newNote) => {
    try {
      newNote.order = noteList.length;
      const saveNewNote = await createNote(newNote);
      setNoteList((prevItems) => [...prevItems, saveNewNote]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleEditNote = (id) => {
    const note = noteList.find((note) => note._id === id);
    if (note) {
      setEditNote(note); // Set the note for editing
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
        }
      }, 0);
    } else {
      console.error("No matching note found for editing");
    }
  };

  const handleSaveEditNote = async (updatedNote) => {
    try {
      setNoteList((prevNoteList) =>
        prevNoteList.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        )
      );
      await updateNote(updatedNote);
      setEditNote({ key: "", _id: "", title: "", content: "" });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      setNoteList((prevNoteList) =>
        prevNoteList.filter((note) => note._id !== id)
      );
      if (id) await removeNote(id);
      else console.error("No matching note found for editing");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Filter notes based on search query
  const filteredResults = noteList.filter(
    (n) =>
      n?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id); // Set the active note being dragged
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = noteList.findIndex((note) => note._id === active.id);
    const newIndex = noteList.findIndex((note) => note._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedNotes = [...noteList];

    // Swap orders of the dragged and target notes
    const tempOrder = updatedNotes[oldIndex].order;
    updatedNotes[oldIndex].order = updatedNotes[newIndex].order;
    updatedNotes[newIndex].order = tempOrder;
    setNoteList([...updatedNotes].sort((a, b) => a.order - b.order)); // Ensure sorting
    // Persist only affected notes
    try {
      await updateNoteOrder([
        {
          _id: updatedNotes[oldIndex]._id,
          order: updatedNotes[oldIndex].order,
        },
        {
          _id: updatedNotes[newIndex]._id,
          order: updatedNotes[newIndex].order,
        },
      ]);
    } catch (error) {
      console.error("Failed to update order:", error);
    }

    
  };

  const renderContent = () => {
    if (loading) {
      return <Info message="Loading..." />;
    }

    if (error) {
      return <Error message={error.message} />;
    }

    return (
      <>
        {!editNote.content ? (
          <AddNote onAdd={addNote}/>
        ) : (
          <UpdateNote note={editNote} saveUpdate={handleSaveEditNote} />
        )}

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredResults}
            strategy={rectSwappingStrategy}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1rem",
                padding: "1rem",
              }}
            >
              {filteredResults.map((n) => (
                <Note
                  key={n._id}
                  id={n._id}
                  title={n?.title}
                  content={n?.content}
                  onDelete={deleteNote}
                  onEdit={handleEditNote}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <Note
                id={activeId}
                {...noteList.find((n) => n._id === activeId)}
                isSortable={false} // Disable sorting for the overlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </>
    );
  };

  return (
    <div className="main">
      <Header onSearch={(text) => setSearchQuery(text)} />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default Notes;
