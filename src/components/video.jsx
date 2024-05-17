import { useRef, useState, useEffect } from "react";
import AddNotes from "./addNote";
import ViewNotes from "./viewNotes";
import style from "./video.module.css";
const Video = ({ videoId }) => {
  const url = `https://www.youtube.com/embed/${videoId}`;
  const [isView, setIsView] = useState(false);
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Load the YouTube IFrame Player API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize the YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          start: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    // Clean up function
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const onPlayerReady = (event) => {
    // You can add additional event handling here if needed
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      // Start a timer to update the current time
      const interval = setInterval(() => {
        setCurrentTime(playerRef.current.getCurrentTime());
      }, 1000);

      // Clear the interval when the video stops playing
      return () => clearInterval(interval);
    }
  };
  function handleViewNotes() {
    setIsView(true);
  }

  return (
    <div className={style.video}>
      {/* <div>
        <div id="youtube-player"></div>
        <p style={{ marginBlockStart: "0rem" }}>
          Current Time: {currentTime} seconds
        </p>
      </div> */}
      <iframe
        className={style.iframe}
        src={url}
        style={{
          marginTop: "5vh",
          width: "60vw",
          height: "60vh",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube Video Player"
      ></iframe>
      <AddNotes videoId={videoId} currentTime={currentTime} />
      {!isView && (
        <button
          onClick={handleViewNotes}
          style={{ width: "2rem", height: "2rem" }}
        >
          View Notes
        </button>
      )}
      {isView && <ViewNotes setIsView={setIsView} videoId={videoId} />}
    </div>
  );
};
export default Video;
