import { useState } from "react";

const AddNote = ({ videoId, currentTime }) => {
  const [data, setData] = useState("");

  function handleData(e) {
    setData(e.target.value);
  }

  function handleAdd() {
    const storedData = localStorage.getItem(videoId);
    const existingNotes = storedData ? JSON.parse(storedData) : [];

    const newNote = {
      id: existingNotes.length, // Assign a unique ID to each note
      note: data,
      time: currentTime,
    };

    const updatedNotes = [...existingNotes, newNote];

    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
  }
  return (
    <div>
      <textarea
        onChange={handleData}
        placeholder="Add Note"
        required
      ></textarea>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};
export default AddNote;
