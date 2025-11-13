import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import style from "../css/videoComments.module.css";

const apikey = process.env.REACT_APP_YOUTUBE_API_KEY;

const VideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");

  const observerRef = useRef(null);

  // ------------------ FETCH COMMENTS ------------------
  const fetchComments = useCallback(
    async (pageToken = "") => {
      try {
        setLoading(true);
        setError(null);

        const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10&pageToken=${pageToken}&key=${apikey}`;

        const res = await axios.get(url);
        const items = res.data.items || [];

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
    },
    [videoId]
  );

  // Reset on video change
  useEffect(() => {
    setComments([]);
    setDisplayedCount(10);
    setSearchInput("");
    setSearchText("");
    fetchComments();
  }, [videoId, fetchComments]);

  // ------------------ SEARCH ------------------
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

  const filteredComments =
    searchText.trim() === ""
      ? comments
      : comments.filter((comment) => {
          const snippet = comment.snippet.topLevelComment.snippet;
          const plainText = getPlainText(snippet.textDisplay).toLowerCase();
          return plainText.includes(searchText.toLowerCase());
        });

  // ------------------ INFINITE SCROLL HANDLER ------------------
  const loadMoreVisible = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      setDisplayedCount((prev) => {
        const limit = filteredComments.length;

        // Show next 10 comments from existing loaded list
        if (prev < limit) {
          return prev + 10;
        }

        // If no more visible comments but API has more pages
        if (prev >= limit && nextPageToken && !loading) {
          fetchComments(nextPageToken);
        }

        return prev;
      });
    },
    [filteredComments.length, nextPageToken, loading, fetchComments]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(loadMoreVisible, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMoreVisible]);

  // ------------------ Search handlers ------------------
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchText(searchInput.trim());
    setDisplayedCount(10);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchText("");
    setDisplayedCount(10);
  };

  const visibleComments = filteredComments.slice(0, displayedCount);
  console.log("Visible Comments Count:", visibleComments);
  console.log("Total Filtered Comments Count:", filteredComments);
  // ------------------ RENDER ------------------
  return (
    <div className={style.outerContainer}>
      <div className={style.container}>
        <h2 className={style.header}>Comments</h2>

        {/* SEARCH BAR */}
        <form className={style.searchContainer} onSubmit={handleSearchSubmit}>
          <div className={style.searchGroup}>
            <input
              type="text"
              placeholder="Search comments..."
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

        {/* COMMENTS LIST */}
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
                      dangerouslySetInnerHTML={{ __html: highlightedText }}
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

        {/* SINGLE SENTINEL FOR INFINITE SCROLL */}
        <div ref={observerRef} className={style.loadingTrigger}>
          <p className={style.loadingMore}>
            {loading ? "Loading more..." : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoComments;
