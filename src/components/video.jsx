import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import AddNotes from "./addNote";
import ViewNotes from "./viewNotes";
import style from "./video.module.css";
import YoutubePlayer from "./ytAPI.jsx";
import VideoDetails from "./videoData.jsx";
const Video = ({ videoId }) => {
  const url = `https://www.youtube.com/embed/${videoId}`;
  const navigate = useNavigate();
  const [isView, setIsView] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  // const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  // useEffect(() => {
  //   // Load the YouTube IFrame Player API
  //   const tag = document.createElement("script");
  //   tag.src = "https://www.youtube.com/iframe_api";
  //   const firstScriptTag = document.getElementsByTagName("script")[0];
  //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  //   // Initialize the YouTube player when API is ready
  //   window.onYouTubeIframeAPIReady = () => {
  //     playerRef.current = new window.YT.Player("youtube-player", {
  //       videoId: videoId,
  //       playerVars: {
  //         autoplay: 1,
  //         start: 0,
  //       },
  //       events: {
  //         onReady: onPlayerReady,
  //         onStateChange: onPlayerStateChange,
  //       },
  //     });
  //   };

  //   // Clean up function
  //   return () => {
  //     if (playerRef.current) {
  //       playerRef.current.destroy();
  //     }
  //   };
  // }, [videoId]);

  // const onPlayerReady = (event) => {
  //   // You can add additional event handling here if needed
  // };

  // const onPlayerStateChange = (event) => {
  //   if (event.data === window.YT.PlayerState.PLAYING) {
  //     // Start a timer to update the current time
  //     const interval = setInterval(() => {
  //       setCurrentTime(playerRef.current.getCurrentTime());
  //     }, 1000);

  //     // Clear the interval when the video stops playing
  //     return () => clearInterval(interval);
  //   }
  // };

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
  return (
    <div className={style.video}>
      {/* <div>
        <div id="youtube-player"></div>
        <p style={{ marginBlockStart: "0rem" }}>
          Current Time: {currentTime} seconds
        </p>
      </div> */}
      <button className={style.backButton} onClick={handleBack}>
        Back
      </button>
      {/* <YoutubePlayer
        setCurrentTimer={setCurrentTime}
        videoId={videoId}
        startTime={1}
        url={url}
      /> */}
      <div className={style.videoFrame}>
        <iframe
          className={style.iframe}
          src={url}
          // style={{
          //   marginTop: "5vh",
          //   width: "60vw",
          //   height: "60vh",
          // }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video Player"
        ></iframe>
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
            <ViewNotes setIsView={setIsView} videoId={videoId} isAdd={isAdd} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Video;
