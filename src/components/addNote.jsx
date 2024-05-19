import { useState } from "react";
import style from "./addNote.module.css";
const AddNote = ({ videoId, currentTime, setIsAdd }) => {
  const [data, setData] = useState("");
  function handleData(e) {
    setData(e.target.value);
  }
  function handleAdd() {
    setIsAdd(false);
    const storedData = localStorage.getItem(videoId);
    const existingNotes = storedData ? JSON.parse(storedData) : [];
    const hours = Math.floor(currentTime / 3600);
    const minutes = Math.floor((currentTime - hours * 3600) / 60);
    const seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);
    const finalHours = hours === 0 ? "" : `${hours}hr`;
    const finalMinutes = minutes === 0 ? "" : `${minutes}min`;
    const finalSeconds = seconds === 0 ? "" : `${seconds}sec`;
    const finalTime = `${finalHours} ${finalMinutes} ${finalSeconds}`;
    const newNote = {
      id: existingNotes.length,
      note: data,
      time: finalTime,
    };
    const updatedNotes = [newNote, ...existingNotes];
    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
  }
  return (
    <div className={style.addNote}>
      <h1 className={style.h1}>Add Note</h1>
      <p className={style.pTime}>
        Adding note at: {Math.floor(currentTime / 3600)}hr{" "}
        {Math.floor((currentTime - Math.floor(currentTime / 3600) * 3600) / 60)}
        min{" "}
        {Math.floor(
          currentTime -
            Math.floor(currentTime / 3600) * 3600 -
            Math.floor(
              (currentTime - Math.floor(currentTime / 3600) * 3600) / 60
            ) *
              60
        )}
        sec
      </p>
      <div className={style.inputContainer}>
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
    </div>
  );
};
export default AddNote;
