import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import AddNotes from "./addNote";
import ViewNotes from "./viewNotes";
import style from "./video.module.css";
import YouTubePlayer from "./ytAPI.jsx";
import VideoDetails from "./videoData.jsx";
const Video = ({ videoId }) => {
  const navigate = useNavigate();
  const [isView, setIsView] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isChange, setIsChange] = useState(null);
  function handleCancel() {
    setIsAdd(false);
  }
  function handleViewNotes() {
    setIsView(true);
  }
  function handleAddNotes() {
    setIsAdd(true);
  }
  function handleBack() {
    navigate("/");
  }
  // console.log(startTime);
  return (
    <div className={style.video}>
      <button className={style.backButton} onClick={handleBack}>
        Back
      </button>
      <div>
        <YouTubePlayer
          videoId={videoId}
          setCurrentTimer={setCurrentTime}
          startTime={startTime}
          setStartTime={setStartTime}
          isChange={isChange}
        />
        <p>Current Time: {currentTime} seconds</p>
      </div>
      <div className={style.videoFrame}>
        <VideoDetails videoId={videoId} />
      </div>
      <div className={style.videoMain}>
        <div className={style.title}>
          <div>
            <h1>My Notes</h1>
            <p>
              All your notes at a single place. Click on any timestamp to go to
              specific timestamp in the video.
            </p>
          </div>
          {!isAdd && (
            <button onClick={handleAddNotes} className={style.button}>
              <CiCirclePlus className={style.icon} />
              Add New Note
            </button>
          )}
          {isAdd && (
            <button onClick={handleCancel} className={style.button}>
              Cancel
            </button>
          )}
        </div>
        {isAdd && (
          <AddNotes
            videoId={videoId}
            currentTime={currentTime}
            setIsAdd={setIsAdd}
          />
        )}
        <div className={style.viewNotesContainer}>
          {!isView && (
            <button className={style.button} onClick={handleViewNotes}>
              View Notes
            </button>
          )}
          {isView && (
            <ViewNotes
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              setIsChange={setIsChange}
              setIsView={setIsView}
              videoId={videoId}
              isAdd={isAdd}
              setStartTime={setStartTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Video;
