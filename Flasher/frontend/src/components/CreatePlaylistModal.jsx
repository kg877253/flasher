import { createPlaylist } from "../api/playlist.api";
import Modal from "./Modal";
import PlaylistForm from "./PlaylistForm";

export default function CreatePlaylistModal({ onClose, onCreated }) {
  const handleSubmit = async (values) => {
    const playlist = await createPlaylist(values);
    onCreated(playlist);
  };

  return (
    <Modal title="New playlist" onClose={onClose}>
      <PlaylistForm submitLabel="Create" onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}