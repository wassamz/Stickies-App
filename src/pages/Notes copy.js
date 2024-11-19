import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Info from "../components/common/Info";
import Error from "../components/common/Error";
import Note from "../components/Note";
import AddNote from "../components/AddNote";
import UpdateNote from "../components/UpdateNote";
import { notes, createNote, updateNote, removeNote } from "../services/Api";

function App() {
  const [noteList, setNoteList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [editNote, setEditNote] = useState({
    key: "",
    _id: "",
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasFetched = useRef(false);
  let navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;

  useEffect(() => {
    const fetchData = async () => {
      let data = null;
      try {
        data = await notes();
        if (data) {
          setNoteList(data);
          setFilteredResults(data);
        }
      } catch (err) {
        //console.error("Error fetching data:", err);
        setLoading(false);
        setError({ message: "Failed to fetch notes" });
        navigate("/"); // navigate on error
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [hasFetched, navigate]);

  async function addNote(newNote) {
    const result = await createNote(newNote);
    setFilteredResults((prevItems) => {
      return [...prevItems, result];
    });
  }

  function handleEditNote(id) {
    let note = noteList.find((note) => note._id === id);
    setEditNote(note);
  }

  function handleSaveEditNote(updatedNote) {
    // Update noteList using map to update the specific note
    setNoteList((prevNoteList) =>
      prevNoteList.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );

    // Update filteredResults only if the edited note matches the current filter criteria
    setFilteredResults((prevFilteredResults) =>
      prevFilteredResults.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
    setEditNote({ key: "", _id: "", title: "", content: "" });
    updateNote(updatedNote);
  }

  function deleteNote(id) {
    setNoteList((prevNoteList) =>
      prevNoteList.filter((note) => note._id !== id)
    );
    setFilteredResults((prevFilteredResults) =>
      prevFilteredResults.filter((note) => note._id !== id)
    );
    removeNote(id);
  }

  function searchNotes(text) {
    if (!text) {
      text = "";
      setFilteredResults(noteList);
    }

    const results = noteList.filter(
      (n) =>
        n?.title.toLowerCase().includes(text.toLowerCase()) ||
        n?.content.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredResults(results);
    return true;
  }

  return (
    <div className="main">
      <Header onSearch={searchNotes} userData={{ userData }} />
      {loading ? (
        <Info message="Loading..." />
      ) : error ? (
        <Error message={error.message} /> // Display error message
      ) : (
        <>
          {editNote?.content === "" ? (
            <div>
              <AddNote onAdd={addNote} />
            </div>
          ) : (
            <UpdateNote
              note={editNote}
              saveUpdate={handleSaveEditNote}
            />
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
      )}

      <Footer />
    </div>
  );
}

export default App;
