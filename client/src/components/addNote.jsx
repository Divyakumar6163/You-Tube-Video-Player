import React, { useState, useEffect, useRef } from "react";
import FileUploader from "./fileUpload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from ".././css/addNote.module.css";

const AddNote = ({ videoId, currentTime, setIsAdd }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const [data, setData] = useState("");
  const [base64File, setBase64File] = useState("");
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const unprivilegedEditor = quillRef.current.makeUnprivilegedEditor(quill);

      const handleChange = () => {
        const editorContent = unprivilegedEditor.getText();
        setIsPlaceholderVisible(editorContent.trim().length === 0);
      };
      quill.on("text-change", handleChange);

      return () => {
        quill.off("text-change", handleChange);
      };
    }
  }, [quillRef]);

  function handleAdd() {
    if (data.trim().length !== 0) {
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
        base64File: base64File,
      };
      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem(videoId, JSON.stringify(updatedNotes));
    }
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
        <ReactQuill
          ref={quillRef}
          theme="snow"
          onChange={setData}
          placeholder="Add Note"
          value={data}
          modules={modules}
          required
        />
        <FileUploader base64File={base64File} setBase64File={setBase64File} />
        <button
          onClick={handleAdd}
          className={style.button}
          disabled={isPlaceholderVisible}
        >
          Add
        </button>
      </div>
      {isPlaceholderVisible && (
        <p style={{ color: "red" }}>*Please Write Something as a Note.</p>
      )}
    </div>
  );
};
export default AddNote;
