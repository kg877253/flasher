import { useEffect, useState } from "react";
import { getUserPlaylists } from "../../api/playlist.api";
import PlaylistCard from "../PlaylistCard";
import EmptyState from "./EmptyState";
import { FolderIcon } from "../Icons";

const grid = "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function PlaylistsTab({ channelId }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchPlaylists = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUserPlaylists(channelId);
        if (!ignore) setPlaylists(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load playlists");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPlaylists();
    return () => {
      ignore = true;
    };
  }, [channelId]);

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="animate-pulse pt-3">
            <div className="aspect-video rounded-xl bg-gray-800" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-800" />
            <div className="mt-2 h-3 w-1/2 rounded bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="mt-10 text-center text-red-400">{error}</p>;

  if (playlists.length === 0) {
    return (
      <EmptyState
        icon={FolderIcon}
        title="No playlists yet"
        text="This channel has not created any playlists."
      />
    );
  }

  return (
    <div className={grid}>
      {playlists.map((playlist, i) => (
        <PlaylistCard key={playlist._id} playlist={playlist} index={i} />
      ))}
    </div>
  );
}