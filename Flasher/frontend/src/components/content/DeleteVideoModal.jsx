import { useState } from "react";
import { deleteVideo } from "../../api/video.api";
import Modal from "../Modal";

export default function DeleteVideoModal({ video, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteVideo(video._id);
      onDeleted(video);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete the video");
      setDeleting(false);
    }
  };

  return (
    <Modal title="Delete video?" onClose={onClose}>
      <p className="text-sm leading-6 text-gray-400">
        “{video.title}” will be deleted for good, together with its likes and comments, and it
        will be removed from every playlist. This cannot be undone.
      </p>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 active:scale-95"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="cursor-pointer rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}