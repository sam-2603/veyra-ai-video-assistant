import { useState } from "react";

export default function Header({ onHome, hasResult }) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          borderBottom: "1px solid var(--border-soft)",
          position: "sticky",
          top: 0,
          background: "rgba(10, 13, 18, 0.85)",
          backdropFilter: "blur(10px)",
          zIndex: 20,
        }}
      >
        <button
          onClick={onHome}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), #b5732a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#17130a",
              fontSize: 15,
            }}
          >
            V
          </span>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 17,
              color: "var(--text-primary)",
            }}
          >
            AI Video Assistant
          </span>
        </button>

        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={onHome}
            className="btn-ghost"
            style={{ border: "none", background: "none" }}
          >
            Home
          </button>

          <button
            onClick={() => setAboutOpen(true)}
            className="btn-ghost"
            style={{ border: "none", background: "none" }}
          >
            About
          </button>

          {hasResult && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: "var(--success)",
                background: "rgba(111,207,151,0.1)",
                padding: "5px 10px",
                borderRadius: 999,
                border: "1px solid rgba(111,207,151,0.25)",
              }}
            >
              Session active
            </span>
          )}
        </nav>
      </header>

      {aboutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setAboutOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5,6,9,0.7)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "24px",
            boxSizing: "border-box",
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 440,
              width: "100%",
              padding: 28,
              boxSizing: "border-box",
              margin: "auto 0",
            }}
          >
            <h3 style={{ marginBottom: 12 }}>About</h3>

            <p style={{ marginBottom: 16 }}>
              AI Video Assistant turns an uploaded video or audio recording
              into a transcript, summary, action items, decisions, and open
              questions — then lets you ask it questions directly using
              retrieval-augmented generation over the transcript.
            </p>

            <button
              className="btn-primary"
              onClick={() => setAboutOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
