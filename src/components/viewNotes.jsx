import style from "./viewNotes.module.css";
import { ImCross } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";

export default function ViewNotes({ videoId, setIsView, isAdd }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem(videoId);
    if (storedData) {
      setNotes(JSON.parse(storedData));
    }
  }, [videoId, isAdd]);

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
      <ImCross
        onClick={handleClose}
        style={{
          cursor: "pointer",
          color: "white",
          position: "absolute",
          justifySelf: "flex-start",
          alignSelf: "flex-start",
        }}
      />
      <h1 className={style.h1}>Notes</h1>
      <div className={style.div}>
        {notes.length === 0 && <p className={style.pNoData}>No Note Found</p>}
        {notes.length > 0 &&
          notes.map((note) => (
            <div key={note.id} className={style.list}>
              <p className={style.pTime}>{note.time}</p>
              <p className={style.pNote}>{note.note}</p>
              <MdDelete
                className={style.delete}
                onClick={() => handleDelete(note.id)}
                style={{ cursor: "pointer" }}
              />
              {/* <hr /> */}
            </div>
          ))}
        <button onClick={handleClose} className={style.button}>
          Close
        </button>
      </div>
    </div>
  );
}
