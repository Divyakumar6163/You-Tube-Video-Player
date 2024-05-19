import style from "./videoId.module.css";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { useState } from "react";
export default function VideoId({
  setVideoId,
  videoId,
  setIsSubmit,
  // isSubmit,
}) {
  const navigate = useNavigate();
  const [videoIdInput, setVideoIdInput] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const handleChange = (e) => {
    setVideoId(e.target.value);
    setIsSubmit(false);
  };
  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmit(true);
    setVideoIdInput(false);
    navigate("/content");
  }
  function handleID() {
    setIsFirst(false);
    setVideoIdInput(true);
  }
  function handleCancel() {
    setVideoIdInput(false);
    setIsSubmit(false);
    setVideoId("");
  }
  console.log(videoId);
  return (
    <div className={style.videoId}>
      {videoIdInput && (
        <form onSubmit={handleSubmit} className={style.form}>
          <ImCross onClick={handleCancel} style={{ position: "absolute" }} />
          <h1 className={style.h1}> Video ID</h1>
          {/* <label htmlFor="" className={style.label}>
            Video ID
          </label> */}
          <input
            type="text"
            value={videoId}
            onChange={handleChange}
            placeholder="Enter YouTube video ID"
            className={style.input}
            style={{ padding: "10px", fontSize: "16px" }}
            required
          />
          {/* {isSubmit === false && (
            <p className={style.p}>Entering the You Tube Video ID</p>
          )} */}
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
          {/* <br /> */}
          <p className={style.pDes}>You made the perfect choice!</p>
          <p className={style.pDes}>
            Your favorite video is now just a click away
          </p>
        </>
      )}
      {!videoIdInput && (
        <button className={style.button} onClick={handleID}>
          Enter Video ID
        </button>
      )}
    </div>
  );
}
