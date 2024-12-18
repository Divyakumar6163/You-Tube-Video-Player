import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CurrentDate from "./currDate.jsx";
import style from ".././css/viewNotes.module.css";

export default function ViewNotes({
  videoId,
  setIsView,
  isAdd,
  setStartTime,
  setIsChange,
  setCurrentTime,
}) {
  const [notes, setNotes] = useState([]);
  const [editedNote, setEditedNote] = useState({
    id: null,
    note: "",
    base64File: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    const storedData = localStorage.getItem(videoId);
    if (storedData) {
      setNotes(JSON.parse(storedData));
    }
  }, [videoId, isAdd]); //If I clicked on ADD button then isAdd will get change.

  function handleEdit(id) {
    setIsView(true);
    const noteToEdit = notes.find((note) => note.id === id);
    setEditedNote({ ...noteToEdit });
    setErrorMessage("");
  }

  function handleSaveEdit() {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const unprivilegedEditor = quillRef.current.makeUnprivilegedEditor(quill);
      const editorContent = unprivilegedEditor.getText().trim();

      if (editorContent.length === 0) {
        setErrorMessage("*Please Write Something as a Note.");
        return;
      }
    }

    const updatedNotes = notes.map((note) =>
      note.id === editedNote.id
        ? { ...note, note: editedNote.note, base64File: editedNote.base64File }
        : note
    );
    setNotes(updatedNotes);
    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
    setIsView(true);
    setEditedNote({ id: null, note: "", base64File: "" });
    setErrorMessage("");
  }

  function handleStartTime(time) {
    const hoursMatch = time.match(/(\d+)\s*hr/);
    const minutesMatch = time.match(/(\d+)\s*min/);
    const secondsMatch = time.match(/(\d+)\s*sec/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;
    const timeSec = hours * 3600 + minutes * 60 + seconds;

    setStartTime(0);
    setCurrentTime(0);
    setTimeout(() => {
      setCurrentTime(timeSec);
      setStartTime(timeSec);
      setIsChange((prev) => !prev);
    }, 0);
  }

  function handleCancelEdit() {
    setEditedNote({ id: null, note: "", base64File: "" });
    setErrorMessage("");
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
                <>
                  <ReactQuill
                    ref={quillRef}
                    className={style.pNote}
                    placeholder="Enter Note"
                    theme="snow"
                    value={editedNote.note}
                    onChange={(value) =>
                      setEditedNote({
                        ...editedNote,
                        note: value,
                      })
                    }
                  />
                  <div className={style.inputAndImage}>
                    <input
                      className={style.inputFile}
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditedNote({
                            ...editedNote,
                            base64File: reader.result,
                          });
                        };
                        if (file) {
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {editedNote.base64File && (
                      <img
                        src={editedNote.base64File}
                        alt="File Not Found"
                        className={style.img}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p
                    className={style.pNote}
                    dangerouslySetInnerHTML={{ __html: note.note }}
                  ></p>
                  {note.base64File && (
                    <img
                      src={note.base64File}
                      alt="File Not Found"
                      className={style.img}
                    />
                  )}
                </>
              )}
              {errorMessage && editedNote.id === note.id && (
                <p style={{ color: "red" }}>{errorMessage}</p>
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
