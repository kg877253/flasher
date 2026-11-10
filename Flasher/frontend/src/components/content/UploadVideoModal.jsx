import { useEffect, useState } from "react";
import { publishVideo } from "../../api/video.api";
import Modal from "../Modal";
import FileField from "./FileField";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // same 100 MB limit as the backend (multer)
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;

export default function UploadVideoModal({ onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [progress, setProgress] = useState(null); // null = not uploading, 0-100 = uploading
  const [error, setError] = useState("");

  const uploading = progress !== null;
  const canSubmit = title.trim() && description.trim() && videoFile && thumbnail && !uploading;

  // Free the preview image from memory when it changes or the modal closes
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const pickVideo = (file) => {
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file");
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setError("The video must be smaller than 100 MB");
      return;
    }
    setError("");
    setVideoFile(file);
  };

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
    if (!canSubmit) return;

    // The field names must match what the backend expects (multer fields)
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    setError("");
    setProgress(0);
    try {
      const video = await publishVideo(formData, setProgress);
      onUploaded(video);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed, please try again");
      setProgress(null);
    }
  };

  // Do not allow closing while the upload is running
  const handleClose = () => {
    if (!uploading) onClose();
  };

  return (
    <Modal title="Upload video" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FileField
          label="Video"
          accept="video/*"
          file={videoFile}
          onChange={pickVideo}
          hint="MP4, WebM... up to 100 MB"
          disabled={uploading}
        />
        <FileField
          label="Thumbnail"
          accept="image/*"
          file={thumbnail}
          onChange={pickThumbnail}
          preview={thumbnailPreview}
          hint="JPG or PNG, up to 10 MB"
          disabled={uploading}
        />

        <label className="block">
          <span className="text-sm text-gray-400">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            disabled={uploading}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-400/60 focus:bg-white/10 disabled:opacity-60"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-400">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={2000}
            disabled={uploading}
            className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-400/60 focus:bg-white/10 disabled:opacity-60"
          />
        </label>

        {uploading && (
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-purple-500 transition-all duration-300 ${
                  progress >= 100 ? "animate-pulse" : ""
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {progress < 100
                ? `Uploading ${progress}%. Keep this window open.`
                : "Processing your video, almost done..."}
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </Modal>
  );
}