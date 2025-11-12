import React, { useEffect, useRef, useState } from "react";

const YouTubePlayer = ({ videoId, setCurrentTimer, startTime, isChange }) => {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          start: startTime,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (!window.YT) {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startTime]);

  useEffect(() => {
    if (playerReady && playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(startTime);
    }
  }, [startTime, playerReady, videoId]);

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const interval = setInterval(
        () => setCurrentTime(event.target.getCurrentTime()),
        1000
      );
      return () => clearInterval(interval);
    }
  };

  useEffect(() => {
    setCurrentTimer(currentTime.toFixed(0));
  }, [currentTime, setCurrentTimer]);

  return (
    <div>
      <div
        id="youtube-player"
        style={{ width: "80vw", height: "60vh", borderRadius: "10px" }}
      ></div>
    </div>
  );
};

export default YouTubePlayer;
