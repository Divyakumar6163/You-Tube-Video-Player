import { useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <VideoID
                className={style.videoID}
                videoId={videoId}
                setVideoId={setVideoId}
                setIsSubmit={setIsSubmit}
                isSubmit={isSubmit}
              />
            }
          />
          {videoId && isSubmit && (
            <Route
              path="/content"
              element={<Video videoId={videoId} className={style.video} />}
            />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
