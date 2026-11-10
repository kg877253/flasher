import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getChannelStats, getChannelVideos } from "../api/dashboard.api";
import { toggleVideoPublish } from "../api/video.api";
import {
  EyeIcon,
  LikeIcon,
  PencilIcon,
  SearchIcon,
  SubscribersIcon,
  TrashIcon,
  UploadIcon,
  VideoIcon,
} from "../components/Icons";
import PageHeader from "../components/PageHeader";
import PurpleButton from "../components/PurpleButton";
import SearchInput from "../components/SearchInput";
import SegmentedControl from "../components/SegmentedControl";
import EmptyState from "../components/channel/EmptyState";
import UploadVideoModal from "../components/content/UploadVideoModal";
import EditVideoModal from "../components/content/EditVideoModal";
import DeleteVideoModal from "../components/content/DeleteVideoModal";
import { formatDuration, formatViews, timeAgo } from "../utils/formatters";

const STATS = [
  { key: "totalVideos", label: "Videos", icon: VideoIcon },
  { key: "totalViews", label: "Views", icon: EyeIcon },
  { key: "totalSubscribers", label: "Subscribers", icon: SubscribersIcon },
  { key: "totalLikes", label: "Likes", icon: LikeIcon },
];

const compact = (number) => new Intl.NumberFormat("en", { notation: "compact" }).format(number);

function ContentRow({ video, busy, leaving, onToggle, onEdit, onDelete }) {
  return (
    <div
      className={`group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:flex-row sm:items-center ${
        leaving ? "scale-95 opacity-0" : ""
      }`}
    >
      <Link
        to={`/videos/${video._id}`}
        className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-gray-800 outline-none focus-visible:ring-2 focus-visible:ring-purple-400 sm:w-44"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            video.isPublished ? "" : "opacity-50"
          }`}
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs font-medium">
          {formatDuration(video.duration)}
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/videos/${video._id}`}
          className="line-clamp-2 font-semibold leading-snug transition-colors hover:text-purple-300"
        >
          {video.title}
        </Link>
        <p className="mt-1 text-sm text-gray-400">
          {formatViews(video.views)} • {timeAgo(video.createdAt)}
        </p>
        <span
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            video.isPublished ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              video.isPublished ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          {video.isPublished ? "Published" : "Hidden"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={video.isPublished}
          aria-label={video.isPublished ? "Hide this video" : "Publish this video"}
          title={video.isPublished ? "Click to hide" : "Click to publish"}
          disabled={busy}
          onClick={() => onToggle(video)}
          className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors disabled:opacity-60 ${
            video.isPublished ? "bg-purple-500" : "bg-white/15"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              video.isPublished ? "translate-x-5" : ""
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => onEdit(video)}
          aria-label="Edit video"
          title="Edit"
          className="cursor-pointer rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-90"
        >
          <PencilIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(video)}
          aria-label="Delete video"
          title="Delete"
          className="cursor-pointer rounded-full p-2 text-gray-300 transition hover:bg-red-500/15 hover:text-red-300 active:scale-90"
        >
          <TrashIcon size={18} />
        </button>
      </div>
    </div>
  );
}

export default function MyContent() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [filterId, setFilterId] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deletingVideo, setDeletingVideo] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [leavingId, setLeavingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchContent = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsData, videosData] = await Promise.all([getChannelStats(), getChannelVideos()]);
        if (ignore) return;
        setStats(statsData);
        setVideos(videosData);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load your content");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchContent();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const publishedCount = videos.filter((video) => video.isPublished).length;
  const filters = [
    { id: "all", label: `All ${videos.length}` },
    { id: "published", label: `Published ${publishedCount}` },
    { id: "hidden", label: `Hidden ${videos.length - publishedCount}` },
  ];

  const visibleVideos = useMemo(() => {
    const search = query.trim().toLowerCase();
    return videos.filter((video) => {
      if (filterId === "published" && !video.isPublished) return false;
      if (filterId === "hidden" && video.isPublished) return false;
      return !search || video.title.toLowerCase().includes(search);
    });
  }, [videos, query, filterId]);

  const refreshStats = () => {
    getChannelStats()
      .then(setStats)
      .catch(() => {}); // the old numbers stay if this fails
  };

  const handleToggle = async (video) => {
    if (busyId) return;
    setBusyId(video._id);
    setActionError("");
    try {
      const updated = await toggleVideoPublish(video._id);
      setVideos((prev) =>
        prev.map((item) =>
          item._id === video._id ? { ...item, isPublished: updated.isPublished } : item
        )
      );
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not change the publish status");
    } finally {
      setBusyId(null);
    }
  };

  const handleUploaded = (video) => {
    setVideos((prev) => [video, ...prev]);
    setStats((prev) => prev && { ...prev, totalVideos: prev.totalVideos + 1 });
    setUploading(false);
  };

  const handleSaved = (updated) => {
    setVideos((prev) =>
      prev.map((item) =>
        item._id === updated._id
          ? {
              ...item,
              title: updated.title,
              description: updated.description,
              thumbnail: updated.thumbnail,
              updatedAt: updated.updatedAt,
            }
          : item
      )
    );
    setEditingVideo(null);
  };

  const handleDeleted = (video) => {
    setDeletingVideo(null);
    setLeavingId(video._id); // plays the exit animation first
    setTimeout(() => {
      setVideos((prev) => prev.filter((item) => item._id !== video._id));
      setLeavingId(null);
      refreshStats();
    }, 250);
  };

  const uploadButton = (
    <PurpleButton onClick={() => setUploading(true)}>
      <UploadIcon size={16} />
      Upload video
    </PurpleButton>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-36 rounded-2xl bg-white/10" />
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-24 rounded-2xl bg-white/10" />
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-24 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState icon={VideoIcon} title="Something went wrong" text={error}>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
        >
          Try again
        </button>
      </EmptyState>
    );
  }

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHeader
        icon={VideoIcon}
        eyebrow="Your channel"
        title="My content"
        description="Upload videos, edit them, and decide which ones everyone can see."
      />

      {/* Channel stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map(({ key, label, icon: Icon }, index) => (
          <div
            key={key}
            className="fade-up flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-semibold">{compact(stats?.[key] || 0)}</p>
              <p className="truncate text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title="You have not uploaded anything yet"
          text="Upload your first video and it will show up here and on your channel."
        >
          {uploadButton}
        </EmptyState>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search your videos..."
              className="lg:w-80"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SegmentedControl
                label="Filter videos"
                options={filters}
                value={filterId}
                onChange={setFilterId}
                className="sm:w-96"
              />
              {uploadButton}
            </div>
          </div>

          {actionError && <p className="mt-4 text-sm text-red-400">{actionError}</p>}

          {visibleVideos.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No videos found"
              text="Nothing matches this search and filter."
            >
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilterId("all");
                }}
                className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 active:scale-95"
              >
                Reset filters
              </button>
            </EmptyState>
          ) : (
            <div key={filterId} className="mt-4 space-y-3">
              {visibleVideos.map((video, index) => (
                <div
                  key={video._id}
                  className="fade-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                >
                  <ContentRow
                    video={video}
                    busy={busyId === video._id}
                    leaving={leavingId === video._id}
                    onToggle={handleToggle}
                    onEdit={setEditingVideo}
                    onDelete={setDeletingVideo}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {uploading && (
        <UploadVideoModal onClose={() => setUploading(false)} onUploaded={handleUploaded} />
      )}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSaved={handleSaved}
        />
      )}
      {deletingVideo && (
        <DeleteVideoModal
          video={deletingVideo}
          onClose={() => setDeletingVideo(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}