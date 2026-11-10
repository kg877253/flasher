import { useEffect, useState } from "react";
import { updateVideo } from "../../api/video.api";
import Modal from "../Modal";
import FileField from "./FileField";

const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;

export default function EditVideoModal({ video, onClose, onSaved }) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const unchanged =
    title.trim() === video.title && description.trim() === video.description && !thumbnail;

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const pickThumbnail = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("The thumbnail must be an image");
      return;
    }
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setError("The thumbnail must be smaller than 10 MB");
      return;
    }
    setError("");
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (thumbnail) formData.append("thumbnail", thumbnail);

    setSaving(true);
    setError("");
    try {
      const updated = await updateVideo(video._id, formData);
      onSaved(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update the video");
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit video" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FileField
          label="Thumbnail (optional)"
          accept="image/*"
          file={thumbnail}
          onChange={pickThumbnail}
          preview={thumbnailPreview || video.thumbnail}
          hint="Choose a new image to replace the current one"
          disabled={saving}
        />

        <label className="block">
          <span className="text-sm text-gray-400">Title</span>
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-400/60 focus:bg-white/10"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-400">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={2000}
            className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-400/60 focus:bg-white/10"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || unchanged}
            className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}