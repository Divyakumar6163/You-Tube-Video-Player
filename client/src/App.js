import { useState } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import style from "./css/App.module.css";
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
              path="/:id"
              element={<Video videoId={videoId} className={style.video} />}
            />
          )}
          {!videoId && <Route
              path="/:id"
              element={<Navigate to="/" replace />}
            />}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
