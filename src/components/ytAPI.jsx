import React, { useEffect, useRef, useState } from "react";

const YoutubePlayer = ({ videoId, startTime, url }) => {
  const playerRef = useRef(url);
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
          start: startTime,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    // Clean up function
    // return () => {
    //   if (playerRef.current) {
    //     playerRef.current.destroy();
    //   }
    // };
  }, [videoId, startTime]);

  const onPlayerReady = (event) => {
    // You can add additional event handling here if needed
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      // Start a timer to update the current time
      const interval = setInterval(() => {
        setCurrentTime(playerRef.current.getCurrentTime());
      }, 1000);
      console.log(interval);
      // Clear the interval when the video stops playing
      return () => clearInterval(interval);
    }
  };
  //   console.log(
  console.log(currentTime);
  return (
    <div>
      <h1>YouTube Player</h1>
      <div id="youtube-player"></div>
      <p>Current Time: {currentTime}</p>
    </div>
  );
};

export default YoutubePlayer;
