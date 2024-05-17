export default function ViewNotes({ videoId, setIsView }) {
  const storedData = localStorage.getItem(videoId);
  const notes = storedData ? JSON.parse(storedData) : [];
  function handleClose() {
    setIsView(false);
  }
  return (
    <div>
      <h1>Notes</h1>
      {notes.length > 0 &&
        notes.map((note) => {
          return (
            <div key={note.id}>
              <p>{note.note}</p>
              <p>{note.time}</p>
            </div>
          );
        })}
      <button onClick={handleClose}>Close</button>
    </div>
  );
}
