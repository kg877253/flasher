import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getUserPlaylists } from "../api/playlist.api";
import { FolderIcon, PlusIcon, SearchIcon } from "../components/Icons";
import PageHeader, { PageHeaderSkeleton } from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import SegmentedControl from "../components/SegmentedControl";
import PurpleButton from "../components/PurpleButton";
import PlaylistCard from "../components/PlaylistCard";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import EmptyState from "../components/channel/EmptyState";
import { toast } from "sonner";

const SORTS = [
  { id: "recent", label: "Recent" },
  { id: "name", label: "A–Z" },
];

const grid = "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function Collection() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [sortId, setSortId] = useState("recent");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchPlaylists = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError("");
      try {
        const data = await getUserPlaylists(user._id);
        if (!ignore) setPlaylists(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load your playlists");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPlaylists();
    return () => {
      ignore = true;
    };
  }, [user?._id, reloadKey]);

  const totalVideos = useMemo(
    () => playlists.reduce((total, playlist) => total + (playlist.videos?.length || 0), 0),
    [playlists]
  );

  const visiblePlaylists = useMemo(() => {
    const search = query.trim().toLowerCase();
    const list = playlists.filter(
      (playlist) =>
        !search ||
        [playlist.name, playlist.description].some((value) =>
          value?.toLowerCase().includes(search)
        )
    );

    if (sortId === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return list;
  }, [playlists, query, sortId]);

  const handleCreated = (playlist) => {
    setPlaylists((prev) => [playlist, ...prev]);
    setQuery("");
    setCreating(false);
    toast.success("Playlist created");
  };

  const newPlaylistButton = (
    <PurpleButton onClick={() => setCreating(true)}>
      <PlusIcon size={16} />
      New playlist
    </PurpleButton>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <PageHeaderSkeleton />
        <div className="mt-6 h-10 w-full rounded-full bg-white/10 sm:w-80" />
        <div className={`mt-6 ${grid}`}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="pt-3">
              <div className="aspect-video rounded-xl bg-white/10" />
              <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
              <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState icon={FolderIcon} title="Something went wrong" text={error}>
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
        icon={FolderIcon}
        title="Collection"
        stats={[
          { value: playlists.length, label: playlists.length === 1 ? "playlist" : "playlists" },
          { value: totalVideos, label: totalVideos === 1 ? "video" : "videos" },
        ]}
        actions={playlists.length > 0 ? newPlaylistButton : null}
      />

      {playlists.length === 0 ? (
        <EmptyState
          icon={FolderIcon}
          title="No playlists yet"
          text="Create your first playlist, then save videos to it from the video page."
        >
          {newPlaylistButton}
        </EmptyState>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search playlists..."
              className="sm:w-80"
            />
            <SegmentedControl
              label="Sort playlists"
              options={SORTS}
              value={sortId}
              onChange={setSortId}
              className="sm:w-48"
            />
          </div>

          {query && (
            <p className="mt-4 text-sm text-gray-500">
              Showing {visiblePlaylists.length} of {playlists.length}
            </p>
          )}

          {visiblePlaylists.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No matches"
              text={`No playlist matches "${query.trim()}".`}
            >
              <button
                type="button"
                onClick={() => setQuery("")}
                className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 active:scale-95"
              >
                Clear search
              </button>
            </EmptyState>
          ) : (
            <div key={sortId} className={`mt-4 ${grid}`}>
              {visiblePlaylists.map((playlist, index) => (
                <PlaylistCard key={playlist._id} playlist={playlist} index={index} />
              ))}
            </div>
          )}
        </>
      )}

      {creating && (
        <CreatePlaylistModal onClose={() => setCreating(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}