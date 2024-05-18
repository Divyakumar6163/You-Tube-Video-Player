import style from "./viewNotes.module.css";
import { ImCross } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import CurrentDate from "./currDate.jsx";

export default function ViewNotes({ videoId, setIsView, isAdd }) {
  const [notes, setNotes] = useState([]);
  const [editedNote, setEditedNote] = useState({ id: null, note: "" });

  useEffect(() => {
    const storedData = localStorage.getItem(videoId);
    if (storedData) {
      setNotes(JSON.parse(storedData));
    }
  }, [videoId, isAdd]);

  function handleEdit(id) {
    setIsView(true);
    const noteToEdit = notes.find((note) => note.id === id);
    setEditedNote({ id: id, note: noteToEdit.note });
  }

  function handleSaveEdit() {
    const updatedNotes = notes.map((note) =>
      note.id === editedNote.id ? { ...note, note: editedNote.note } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
    setIsView(true);
    setEditedNote({ id: null, note: "" });
  }

  function handleCancelEdit() {
    setEditedNote({ id: null, note: "" });
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem(videoId, JSON.stringify(updatedNotes));
    }
  }

  function handleClose() {
    setIsView(false);
  }

  return (
    <div className={style.viewNotes}>
      <div className={style.div}>
        {notes.length === 0 && <p className={style.pNoData}>No Note Found</p>}
        {notes.length > 0 &&
          notes.map((note) => (
            <div key={note.id} className={style.list}>
              <CurrentDate />
              <p className={style.pTime}>Timestamp: {note.time}</p>
              {editedNote.id === note.id ? (
                <input
                  className={style.pNote}
                  value={editedNote.note}
                  onChange={(e) =>
                    setEditedNote({
                      ...editedNote,
                      note: e.target.value,
                    })
                  }
                />
              ) : (
                <p className={style.pNote}>{note.note}</p>
              )}
              <div className={style.buttons}>
                {editedNote.id === note.id ? (
                  <button
                    className={style.delete}
                    onClick={handleSaveEdit}
                    style={{ cursor: "pointer" }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className={style.delete}
                    onClick={() => handleEdit(note.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Edit note
                  </button>
                )}
                {editedNote.id !== note.id ? (
                  <button
                    className={style.delete}
                    onClick={() => handleDelete(note.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Delete note
                  </button>
                ) : (
                  <button
                    className={style.delete}
                    onClick={handleCancelEdit}
                    style={{ cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
              <hr className={style.hr} />
            </div>
          ))}
        <div className={style.buttonContainer}>
          <button onClick={handleClose} className={style.button}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
