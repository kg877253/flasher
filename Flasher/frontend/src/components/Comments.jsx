import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  addComment,
  deleteComment,
  getCommentsByVideoId,
  updateComment,
} from "../api/comment.api";
import { toggleCommentLike } from "../api/like.api";
import { timeAgo } from "../utils/formatters";
import { LikeIcon, PencilIcon, TrashIcon } from "./Icons";

const LIMIT = 10;

export default function Comments({ videoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Load the first page whenever the video changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCommentsByVideoId(videoId, { page: 1, limit: LIMIT });
        setComments(data.docs);
        setTotal(data.totalDocs);
        setPage(1);
        setHasNextPage(data.hasNextPage);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleShowMore = async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    setError(null);
    try {
      const data = await getCommentsByVideoId(videoId, { page: page + 1, limit: LIMIT });

      // A new comment can shift the pages, so skip the comments we already have
      const existingIds = new Set(comments.map((comment) => comment._id));
      const newComments = data.docs.filter((comment) => !existingIds.has(comment._id));

      setComments([...comments, ...newComments]);
      setPage(page + 1);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load more comments");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (posting || !text.trim()) return;

    setPosting(true);
    setError(null);
    try {
      const newComment = await addComment(videoId, text.trim());
      // The backend sends only the owner id, so we attach the logged-in user for display
      setComments([{ ...newComment, owner: user, likesCount: 0, isLiked: false }, ...comments]);
      setTotal(total + 1);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim() || busyId) return;

    setBusyId(commentId);
    setError(null);
    try {
      const updated = await updateComment(commentId, editText.trim());
      setComments((current) =>
        current.map((comment) =>
          comment._id === commentId ? { ...comment, content: updated.content } : comment
        )
      );
      setEditingId(null);
      setEditText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update comment");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (commentId) => {
    if (busyId || !window.confirm("Delete this comment?")) return;

    setBusyId(commentId);
    setError(null);
    try {
      await deleteComment(commentId);
      setComments((current) => current.filter((comment) => comment._id !== commentId));
      setTotal((current) => Math.max(0, current - 1));
      if (editingId === commentId) setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
    } finally {
      setBusyId(null);
    }
  };

  const handleLike = async (commentId) => {
    if (busyId) return;

    setBusyId(commentId);
    setError(null);
    try {
      const result = await toggleCommentLike(commentId);
      setComments((current) =>
        current.map((comment) =>
          comment._id === commentId
            ? { ...comment, isLiked: result.isLiked, likesCount: result.likesCount }
            : comment
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update comment like");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">
        {total} {total === 1 ? "Comment" : "Comments"}
      </h2>

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3 border-2 border-gray-400 p-3 rounded-lg">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="h-10 w-10 shrink-0 rounded-full bg-gray-700 object-cover"
        />
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border-b border-gray-600 bg-transparent pb-1 outline-none focus:border-white"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setText("")}
              className="rounded-full px-4 py-1.5 text-sm hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="rounded-full bg-purple-500 px-4 py-1.5 text-sm font-medium hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {posting ? "Posting..." : "Comment"}
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </form>

      {/* Comment list */}
      {loading ? (
        <p className="mt-6 text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="mt-6 text-gray-400">No comments yet. Be the first one!</p>
      ) : (
        <ul className="mt-6 space-y-5">
          {comments.map((comment) => {
            const isOwner = user?._id === comment.owner?._id;
            const isEditing = editingId === comment._id;
            return (
            <li key={comment._id} className="flex gap-3">
              <img
                src={comment.owner?.avatar}
                alt={comment.owner?.username}
                className="h-10 w-10 shrink-0 rounded-full bg-gray-700 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">@{comment.owner?.username}</span>{" "}
                  <span className="text-gray-400">{timeAgo(comment.createdAt)}</span>
                </p>
                {isEditing ? (
                  <div className="mt-2">
                    <input
                      autoFocus
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      className="w-full border-b border-gray-600 bg-transparent pb-1 outline-none focus:border-white"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="rounded-full px-3 py-1 text-xs hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busyId === comment._id || !editText.trim()}
                        onClick={() => handleEdit(comment._id)}
                        className="rounded-full bg-purple-500 px-3 py-1 text-xs font-medium disabled:opacity-50"
                      >
                        {busyId === comment._id ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 whitespace-pre-line break-words">{comment.content}</p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <button
                    type="button"
                    onClick={() => handleLike(comment._id)}
                    disabled={busyId === comment._id}
                    className={`inline-flex cursor-pointer items-center gap-1 transition hover:text-white ${
                      comment.isLiked ? "text-purple-300" : ""
                    }`}
                  >
                    <LikeIcon size={15} />
                    {comment.likesCount || 0}
                  </button>
                  {isOwner && !isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditText(comment.content);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 hover:text-white"
                      >
                        <PencilIcon size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(comment._id)}
                        disabled={busyId === comment._id}
                        className="inline-flex cursor-pointer items-center gap-1 hover:text-red-300 disabled:opacity-50"
                      >
                        <TrashIcon size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
            );
          })}
        </ul>
      )}

      {/* Show more */}
      {hasNextPage && (
        <button
          onClick={handleShowMore}
          disabled={loadingMore}
          className="mt-5 cursor-pointer rounded-full border border-gray-600 px-4 py-2 text-sm font-medium hover:bg-white/10 disabled:opacity-60"
        >
          {loadingMore ? "Loading..." : "Show more comments"}
        </button>
      )}
    </section>
  );
}