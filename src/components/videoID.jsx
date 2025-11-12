import style from ".././css/videoId.module.css";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { useState } from "react";
import MovingCards from "./movingCards";

export default function VideoId({ setVideoId, videoId, setIsSubmit }) {
  const navigate = useNavigate();
  const [videoIdInput, setVideoIdInput] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  const extractVideoId = (url) => {
    try {
      const regex =
        /(?:v=|\/)([0-9A-Za-z_-]{10,})/;
      const match = url.match(regex);
      console.log(match);
      return match ? match[1] : url.trim();
    } catch {
      return url.trim();
    }
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const id = extractVideoId(rawValue);
    setVideoId(id);
    setIsSubmit(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoId) return;
    setIsSubmit(true);
    setVideoIdInput(false);
    navigate(`/${videoId}`);
  };

  const handleID = () => {
    setIsFirst(false);
    setVideoIdInput(true);
  };

  const handleCancel = () => {
    setVideoIdInput(false);
    setIsSubmit(false);
    setVideoId("");
  };

  console.log(videoId);

  return (
    <div className={style.videoId}>
      {videoIdInput && (
        <form onSubmit={handleSubmit} className={style.form}>
          <ImCross onClick={handleCancel} style={{ position: "absolute" }} />
          <h1 className={style.h1}>Video Link</h1>
          <input
            type="text"
            value={videoId}
            onChange={handleChange}
            placeholder="Paste video link or ID"
            className={style.input}
            style={{ padding: "10px", fontSize: "16px" }}
            required
          />
          <button
            type="submit"
            className={style.buttonSubmit}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            Submit
          </button>
        </form>
      )}

      {isFirst && (
        <>
          <p className={style.pStart}>WELCOME</p>
          <p className={style.pDes}>You made the perfect choice!</p>
          <p className={style.pDes}>
            Your favorite video is now just a click away
          </p>
        </>
      )}

      {!videoIdInput && (
        <button className={style.button} onClick={handleID}>
          Enter Video Link
        </button>
      )}

      <div className={style.movingCards}>
        <MovingCards />
      </div>
    </div>
  );
}
