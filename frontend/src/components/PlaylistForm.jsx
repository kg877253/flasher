import { useState } from "react";

const ghostButton =
  "cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 active:scale-95";

// onSubmit({ name, description }) is async. If it throws, the error is shown under the fields.
export default function PlaylistForm({ submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Name and description are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-gray-400">Name</span>
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={100}
          placeholder="e.g. Watch later"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-600 focus:border-purple-400/60 focus:bg-white/10"
        />
      </label>
      <label className="block">
        <span className="text-sm text-gray-400">Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="What is this playlist about?"
          className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-600 focus:border-purple-400/60 focus:bg-white/10"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className={ghostButton}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving || !name.trim() || !description.trim()}
          className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}