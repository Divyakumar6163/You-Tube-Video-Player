import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import AddNotes from "./addNote";
import ViewNotes from "./viewNotes";
import style from ".././css/video.module.css";
import YouTubePlayer from "./ytAPI.jsx";
import VideoDetails from "./videoData.jsx";
import VideoComments from "./videoComments.jsx";
const Video = ({ videoId: propVideoId }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  let videoId = (propVideoId || id || "");

  const [isView, setIsView] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isChange, setIsChange] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [checking, setChecking] = useState(true);

  const alertShownRef = useRef(false);

  useEffect(() => {
    if (!videoId) {
      navigate("/", { replace: true });
    }
  }, [videoId, navigate]);

  useEffect(() => {
    const checkVideoValidity = async () => {
      if (!videoId) return;
      setChecking(true);
      try {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );

        if (res.ok) {
          setIsValid(true);
        } else {
          if (!alertShownRef.current) {
            alert("Invalid VideoID or restricted content");
            alertShownRef.current = true;
          }
          setIsValid(false);
        }
      } catch (err) {
        console.error("Error checking video:", err);
        if (!alertShownRef.current) {
          alert("Invalid or unreachable video");
          alertShownRef.current = true;
        }
        setIsValid(false);
      } finally {
        setChecking(false);
      }
    };

    checkVideoValidity();
  }, [videoId]);

  useEffect(() => {
    if (!checking && !isValid) {
      navigate("/", { replace: true });
    }
  }, [checking, isValid, navigate]);

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

  if (checking) {
    return (
      <div className={style.video}>
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Checking video validity...
        </p>
      </div>
    );
  }

  if (!isValid || !videoId) {
    return null;
  }

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

          {!isAdd ? (
            <button onClick={handleAddNotes} className={style.button}>
              <CiCirclePlus className={style.icon} />
              Add New Note
            </button>
          ) : (
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
          {!isView ? (
            <button className={style.button} onClick={handleViewNotes}>
              View Notes
            </button>
          ) : (
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
      <VideoComments videoId={videoId}/>
    </div>
  );
};

export default Video;
