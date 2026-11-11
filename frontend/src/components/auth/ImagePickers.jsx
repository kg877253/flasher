import { useEffect, useRef, useState } from "react";
import { ImageIcon, UploadIcon, UserIcon } from "../Icons";

// Keeps a preview URL for the picked file and frees it on change or unmount
function usePreview() {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return [preview, (file) => setPreview(URL.createObjectURL(file))];
}

export function AvatarPicker({ onChange, invalid, index = 0 }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = usePreview();

  const handlePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(file);
    onChange(file);
  };

  return (
    <div className="fade-up flex items-center gap-4" style={{ animationDelay: `${index * 70}ms` }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Choose avatar"
        className={`group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition ${
          invalid ? "border-red-400/60" : "border-white/20 hover:border-purple-400/70"
        }`}
      >
        {preview ? (
          <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
        ) : (
          <UserIcon size={28} className="text-gray-500" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
          <UploadIcon size={20} />
        </span>
      </button>

      <div>
        <p className="text-sm font-medium text-gray-300">Profile photo</p>
        <p className="text-xs text-gray-500">Required</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handlePick}
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  );
}

export function CoverPicker({ onChange, index = 0 }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = usePreview();

  const handlePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(file);
    onChange(file);
  };

  return (
    <div className="fade-up" style={{ animationDelay: `${index * 70}ms` }}>
      <p className="mb-1.5 text-sm font-medium text-gray-300">
        Cover image <span className="font-normal text-gray-500">(optional)</span>
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Choose cover image"
        className="group relative flex h-24 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/20 transition hover:border-purple-400/70"
      >
        {preview ? (
          <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
        ) : (
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <ImageIcon size={18} />
            Add a cover image
          </span>
        )}
        {preview && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm opacity-0 transition group-hover:opacity-100">
            Change
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handlePick}
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  );
}