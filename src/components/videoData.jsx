import React, { useState, useEffect } from "react";
import axios from "axios";
import style from ".././css/videoData.module.css";
const YOUTUBE_API_KEY = "AIzaSyAvCFNw-ZJN693l5_16WGkXjLDiUs5IRTA";

const fetchVideoDetails = async (videoId) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`;
  try {
    const response = await axios.get(url);
    const videoDetails = response.data.items[0].snippet;
    console.log(videoDetails);
    return {
      title: videoDetails.title,
      description: videoDetails.description,
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
};

const VideoDetails = ({ videoId }) => {
  const [videoDetails, setVideoDetails] = useState(null);

  useEffect(() => {
    const getVideoDetails = async () => {
      const details = await fetchVideoDetails(videoId);
      setVideoDetails(details);
    };

    getVideoDetails();
  }, [videoId]);
  if (!videoDetails) {
    return <div className={style.load}>Loading...</div>;
  }

  return (
    <div className={style.div}>
      <h1 className={style.h1}>{videoDetails.title}</h1>
      <p className={style.p}>{videoDetails.description}</p>
    </div>
  );
};

export default VideoDetails;
