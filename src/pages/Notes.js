import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddNote from "../components/AddNote";
import Error from "../components/common/Error";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Info from "../components/common/Info";
import Note from "../components/Note";
import UpdateNote from "../components/UpdateNote";
import { createNote, notes, removeNote, updateNote } from "../services/Api";

function App() {
  const [noteList, setNoteList] = useState([]);
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
  const location = useLocation();
  const userData = location.state?.userData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await notes();
        if (data) {
          setNoteList(data);
        }
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
      const result = await createNote(newNote);
      setNoteList((prevItems) => [...prevItems, result]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleEditNote = (id) => {
    const note = noteList.find((note) => note._id === id);
    setEditNote(note);
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
      await removeNote(id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Filter notes based on search query
  const filteredResults = noteList.filter(
    (n) =>
      n?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <AddNote onAdd={addNote} />
        ) : (
          <UpdateNote note={editNote} saveUpdate={handleSaveEditNote} />
        )}

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
      </>
    );
  };

  return (
    <div className="main">
      <Header onSearch={handleSearchChange} userData={{ userData }} />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
