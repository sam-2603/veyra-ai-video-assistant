import { useRef, useState } from "react";

export default function VideoInput({ onSubmit, disabled }) {
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setLocalError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (!file) {
      setLocalError("Choose an audio or video file to upload.");
      return;
    }

    onSubmit({ type: "upload", file });
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={styles.card}>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        style={styles.dropzone}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={disabled}
        />

        {file ? (
          <span style={{ color: "var(--text-primary)" }}>
            {file.name}
          </span>
        ) : (
          <span>Click to choose an audio or video file</span>
        )}
      </button>

      <p style={styles.limit}>
        Maximum video length: 5 minutes
      </p>

      {localError && (
        <p style={styles.error}>
          {localError}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary"
        disabled={disabled}
        style={{ width: "100%" }}
      >
        Analyze Video
      </button>
    </form>
  );
}

const styles = {
  card: {
    padding: 26,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "var(--shadow-1)",
  },

  dropzone: {
    padding: "22px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px dashed var(--border)",
    background: "var(--surface-raised)",
    color: "var(--text-secondary)",
    fontSize: 14,
    textAlign: "center",
  },

  limit: {
    margin: "-6px 0 0",
    color: "var(--text-secondary)",
    fontSize: 12,
    textAlign: "center",
  },

  error: {
    color: "var(--danger)",
    fontSize: 13,
    margin: 0,
  },
};