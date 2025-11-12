import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import style from "../css/videoComments.module.css";

const YOUTUBE_API_KEY = "AIzaSyAvCFNw-ZJN693l5_16WGkXjLDiUs5IRTA";

const VideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search states
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");

  const observerRef = useRef(null);

  const fetchComments = async (pageToken = "") => {
    try {
      setLoading(true);
      setError(null);
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`;
      const res = await axios.get(url);
      const items = res.data.items || [];

      // ✅ Remove duplicates by ID
      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newItems = items.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newItems];
      });

      setNextPageToken(res.data.nextPageToken || null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Unable to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setComments([]);
    setSearchInput("");
    setSearchText("");
    setDisplayedCount(10);
    fetchComments();
  }, [videoId]);

  const getPlainText = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const highlightText = (text, phrase) => {
    if (!phrase.trim()) return text;
    const regex = new RegExp(
      `(${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(regex, `<mark class="${style.highlight}">$1</mark>`);
  };

  // ✅ Filter comments only when search is applied
  const filteredComments =
    searchText.trim() === ""
      ? comments
      : comments.filter((comment) => {
          const snippet = comment.snippet.topLevelComment.snippet;
          const plainText = getPlainText(snippet.textDisplay).toLowerCase();
          return plainText.includes(searchText.toLowerCase());
        });

  // ✅ Lazy loading handler
  const loadMoreVisible = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setDisplayedCount((prev) => {
          // ⛔ Prevent unnecessary increments when already all visible
          if (prev < filteredComments.length) {
            return prev + 10;
          }
          return prev;
        });
      }
    },
    [filteredComments.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(loadMoreVisible, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMoreVisible, filteredComments.length]);

  // ✅ Search triggers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setSearchText(trimmed);
    setDisplayedCount(10);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchText("");
    setDisplayedCount(10);
  };

  const visibleComments = filteredComments.slice(0, displayedCount);
  console.log("Filtered comments:", filteredComments);
  console.log("Visible comments:", visibleComments);
  return (
    <div className={style.outerContainer}>
      <div className={style.container}>
        <h2 className={style.header}>Comments</h2>

        {/* 🔍 Search bar */}
        <form className={style.searchContainer} onSubmit={handleSearchSubmit}>
          <div className={style.searchGroup}>
            <input
              type="text"
              placeholder="Search comments (exact phrase)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={style.searchInput}
            />
            <button type="submit" className={style.searchButton}>
              Search
            </button>
            {searchText && (
              <button
                type="button"
                onClick={handleClear}
                className={style.clearButton}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {error && <p className={style.error}>{error}</p>}

        {loading && comments.length === 0 && (
          <p className={style.loading}>Loading comments...</p>
        )}

        <div className={style.commentsList}>
          {visibleComments.length > 0 ? (
            visibleComments.map((comment, index) => {
              const snippet = comment.snippet.topLevelComment.snippet;
              const plainText = getPlainText(snippet.textDisplay);
              const highlightedText = highlightText(plainText, searchText);
              return (
                <div key={`${comment.id}-${index}`} className={style.comment}>
                  <img
                    src={snippet.authorProfileImageUrl}
                    alt={snippet.authorDisplayName}
                    className={style.avatar}
                  />
                  <div className={style.commentContent}>
                    <div className={style.commentHeader}>
                      <span className={style.author}>
                        {snippet.authorDisplayName}
                      </span>
                      <span className={style.date}>
                        {new Date(snippet.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p
                      className={style.text}
                      dangerouslySetInnerHTML={{
                        __html: highlightedText,
                      }}
                    ></p>

                    <div className={style.likes}>
                      <span>👍 {snippet.likeCount}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={style.noResults}>
              {searchText
                ? "No comments contain the entered phrase."
                : "No comments found."}
            </p>
          )}
        </div>

        {/* 👇 Lazy loading trigger */}
        {visibleComments.length < filteredComments.length && (
          <div ref={observerRef} className={style.loadingTrigger}>
            <p className={style.loadingMore}>Scroll to load more...</p>
          </div>
        )}

        {/* Load next page if available */}
        {nextPageToken && !loading && (
          <button
            onClick={() => fetchComments(nextPageToken)}
            className={style.loadMore}
          >
            Load More Comments from YouTube
          </button>
        )}

        {loading && comments.length > 0 && (
          <p className={style.loadingMore}>Loading more...</p>
        )}
      </div>
    </div>
  );
};

export default VideoComments;
