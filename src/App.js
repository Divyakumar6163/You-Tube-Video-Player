import { useState } from "react";
import style from "./app.module.css";
import Header from "./components/header";
import Video from "./components/video";
import VideoID from "./components/videoID";
function App() {
  const [videoId, setVideoId] = useState("");
  const [isSubmit, setIsSubmit] = useState("");
  return (
    <div>
      <Header />
      <div className={style.app}>
        <VideoID
          className={style.videoID}
          videoId={videoId}
          setVideoId={setVideoId}
          setIsSubmit={setIsSubmit}
          isSubmit={isSubmit}
        />
        {videoId && isSubmit && (
          <Video videoId={videoId} className={style.video} />
        )}
      </div>
    </div>
  );
}

export default App;
