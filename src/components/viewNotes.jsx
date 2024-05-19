import React, { useState, useEffect } from "react";
import CurrentDate from "./currDate.jsx";
import style from "./viewNotes.module.css";

export default function ViewNotes({
  videoId,
  currentTime,
  setIsView,
  isAdd,
  setStartTime,
  setIsChange,
  setCurrentTime,
}) {
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

  function handleStartTime(time) {
    const hoursMatch = time.match(/(\d+)\s*hr/);
    const minutesMatch = time.match(/(\d+)\s*min/);
    const secondsMatch = time.match(/(\d+)\s*sec/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;
    const timeSec = hours * 3600 + minutes * 60 + seconds;

    // Clear and then set the current time
    setStartTime(0);
    setCurrentTime(0);
    setTimeout(() => {
      setCurrentTime(timeSec);
      setStartTime(timeSec);
      setIsChange((prev) => !prev);
    }, 10);
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
              <p className={style.pTime}>
                Timestamp:{" "}
                <span
                  className={style.pTimeSpan}
                  onClick={() => handleStartTime(note.time)}
                >
                  {note.time}
                </span>
              </p>
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
