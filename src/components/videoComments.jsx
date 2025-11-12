import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import style from "../css/videoComments.module.css";

const YOUTUBE_API_KEY = "AIzaSyAvCFNw-ZJN693l5_16WGkXjLDiUs5IRTA";

const VideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔎 new: separate input vs. committed query
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const fetchComments = async (pageToken = "") => {
    try {
      setLoading(true);
      setError(null);
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`;
      const res = await axios.get(url);
      const items = res.data.items || [];
      setComments((prev) => [...prev, ...items]);
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
    setQuery("");       // reset search on video change
    setSearchInput("");
    fetchComments();
  }, [videoId]);

  // 🧰 helpers
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const getPlainText = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // ✔ exact word match; search only when user submits (query set)
  const filteredComments = useMemo(() => {
    console.log("Filtering comments with query:", query);
    if (!query.trim()) return comments;

    // word-boundary regex (case-insensitive)
    const rx = new RegExp(`\\b${escapeRegExp(query)}\\b`, "i");

    return comments.filter((c) => {
      const snippet = c.snippet.topLevelComment.snippet;
      const text = getPlainText(snippet.textDisplay);
      return rx.test(text);
    });
  }, [comments, query]);

  // ✅ highlight only exact matches when query is set
  const highlightSearch = (html) => {
    if (!query.trim()) return html;
    const rx = new RegExp(`\\b(${escapeRegExp(query)})\\b`, "gi");
    return html.replace(rx, `<mark class="${style.highlight}">$1</mark>`);
  };

  // 🔘 search triggers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setQuery("");
  };
  console.log()
  return (
    <div className={style.outerContainer}>
      <div className={style.container}>
        <h2 className={style.header}>Comments</h2>

        {/* 🔎 Search (submit to apply) */}
        <form className={style.searchContainer} onSubmit={handleSearchSubmit}>
          <div className={style.searchGroup}>
            <input
              type="text"
              placeholder="Search comments (exact word)…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={style.searchInput}
            />
            <button type="submit" className={style.searchButton}>
              Search
            </button>
            {query && (
              <button type="button" onClick={handleClear} className={style.clearButton}>
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
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => {
              const snippet = comment.snippet.topLevelComment.snippet;
              return (
                <div key={comment.id} className={style.comment}>
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
                        __html: highlightSearch(snippet.textDisplay),
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
              {query ? "No comments match your exact word." : "No comments found."}
            </p>
          )}
        </div>

        {nextPageToken && !loading && (
          <button
            onClick={() => fetchComments(nextPageToken)}
            className={style.loadMore}
          >
            Load More Comments
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
