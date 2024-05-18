import { useState } from "react";
import { ImCross } from "react-icons/im";
import style from "./addNote.module.css";
const AddNote = ({ videoId, currentTime, setIsAdd }) => {
  const [data, setData] = useState("");

  function handleData(e) {
    setData(e.target.value);
  }
  function handleClose() {
    setIsAdd(false);
  }
  function handleAdd() {
    setIsAdd(false);
    const storedData = localStorage.getItem(videoId);
    const existingNotes = storedData ? JSON.parse(storedData) : [];

    const newNote = {
      id: existingNotes.length, // Assign a unique ID to each note
      note: data,
      time: currentTime,
    };

    const updatedNotes = [newNote, ...existingNotes];

    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
  }
  return (
    <div className={style.addNote}>
      <ImCross onClick={handleClose} style={{ cursor: "pointer" }} />
      <h1 className={style.h1}>Add Note</h1>
      <textarea
        className={style.textarea}
        onChange={handleData}
        placeholder="Add Note"
        required
      ></textarea>
      <button onClick={handleAdd} className={style.button}>
        Add
      </button>
    </div>
  );
};
export default AddNote;
