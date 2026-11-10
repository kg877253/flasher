import { useState } from "react";
import { UploadIcon } from "../Icons";

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// A click-or-drop file picker. The parent checks the file type and size in onChange.
export default function FileField({ label, accept, file, onChange, hint, preview, disabled }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <span className="text-sm text-gray-400">{label}</span>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const dropped = event.dataTransfer.files[0];
          if (!disabled && dropped) onChange(dropped);
        }}
        className={`mt-1 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-3 transition ${
          dragging
            ? "border-purple-400 bg-purple-500/10"
            : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            const picked = event.target.files?.[0];
            if (picked) onChange(picked);
            event.target.value = ""; // so the same file can be picked again
          }}
        />

        {preview ? (
          <img src={preview} alt="" className="h-12 w-20 shrink-0 rounded-md object-cover" />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
            <UploadIcon size={22} />
          </span>
        )}

        <span className="min-w-0 flex-1 text-sm">
          {file ? (
            <>
              <span className="block truncate font-medium">{file.name}</span>
              <span className="text-xs text-gray-500">
                {formatFileSize(file.size)} • click to change
              </span>
            </>
          ) : (
            <>
              <span className="block font-medium">Choose a file or drop it here</span>
              <span className="text-xs text-gray-500">{hint}</span>
            </>
          )}
        </span>
      </label>
    </div>
  );
}