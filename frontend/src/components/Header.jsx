import { useState } from "react";

export default function Header({ onHome, hasResult }) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header style={styles.header}>
        <div style={styles.inner}>

          {/* Brand */}
          <button onClick={onHome} style={styles.brand}>
            <div style={styles.logo}>
              <span style={styles.logoWave}>≈</span>
            </div>

            <div style={styles.brandText}>
              <div style={styles.name}>Veyra</div>
              <div style={styles.tagline}>
                AUDIO-VISUAL INTELLIGENCE
              </div>
            </div>
          </button>

          {/* Navigation */}
          <nav style={styles.nav}>
            <button
              onClick={onHome}
              style={styles.navButton}
            >
              {hasResult ? "New Analysis" : "Analyze"}
            </button>

            <button
              onClick={() => setAboutOpen(true)}
              style={styles.navButton}
            >
              About
            </button>
          </nav>
        </div>
      </header>

      {/* About Modal */}
      {aboutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setAboutOpen(false)}
          style={styles.overlay}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={styles.modal}
          >
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalLabel}>
                  ABOUT VEYRA
                </div>

                <h2 style={styles.modalTitle}>
                  Audio-Visual Intelligence
                </h2>
              </div>

              <button
                onClick={() => setAboutOpen(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            {/* Description */}
            <p style={styles.description}>
              Veyra is an audio-visual analysis system designed to
              examine how sound and visual movement behave together
              inside a media recording.
            </p>

            <p style={styles.description}>
              It processes the audio and video streams independently,
              extracts measurable activity signals, and compares
              them over time to estimate synchronization differences.
            </p>

            {/* Analysis cards */}
            <div style={styles.features}>

              <Feature
                title="Audio Analysis"
                text="Detects speech activity from the extracted audio stream."
              />

              <Feature
                title="Facial Analysis"
                text="Tracks facial landmarks and mouth movement across video frames."
              />

              <Feature
                title="Sync Analysis"
                text="Compares audio and visual activity to estimate temporal offset."
              />

            </div>

            {/* Technology */}
            <div style={styles.techSection}>
              <div style={styles.modalLabel}>
                TECHNOLOGY
              </div>

              <div style={styles.techList}>
                <span>Python</span>
                <span>OpenCV</span>
                <span>MediaPipe</span>
                <span>FFmpeg</span>
                <span>WebRTC VAD</span>
                <span>FastAPI</span>
                <span>React</span>
              </div>
            </div>

            <button
              onClick={() => setAboutOpen(false)}
              style={styles.closePrimary}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Feature({ title, text }) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureDot}></div>

      <div>
        <h3 style={styles.featureTitle}>
          {title}
        </h3>

        <p style={styles.featureText}>
          {text}
        </p>
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: 72,
    width: "100%",
    boxSizing: "border-box",
    borderBottom: "1px solid rgba(126, 139, 180, 0.12)",
    background: "rgba(7, 10, 17, 0.92)",
    backdropFilter: "blur(14px)",
    position: "relative",
    zIndex: 20,
  },

  inner: {
    height: "100%",
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    border: "none",
    background: "transparent",
    padding: 0,
    color: "inherit",
    cursor: "pointer",
    textAlign: "left",
  },

  logo: {
    width: 38,
    height: 38,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #64e6ff 0%, #7f76ff 55%, #b47cff 100%)",
    boxShadow: "0 0 24px rgba(100, 230, 255, 0.14)",
  },

  logoWave: {
    color: "#071018",
    fontSize: 25,
    fontWeight: 800,
    lineHeight: 1,
  },

  brandText: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  name: {
    color: "#f1f4ff",
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: "-0.3px",
  },

  tagline: {
    color: "#66718b",
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: "1.3px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: 28,
  },

  navButton: {
    border: "none",
    background: "transparent",
    color: "#8b95ac",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 0",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(3, 5, 10, 0.78)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    boxSizing: "border-box",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: 620,
    maxHeight: "85vh",
    overflowY: "auto",
    boxSizing: "border-box",
    padding: 30,
    borderRadius: 20,
    border: "1px solid rgba(126, 139, 180, 0.18)",
    background:
      "linear-gradient(145deg, #111727, #0b0f1a)",
    boxShadow:
      "0 30px 100px rgba(0, 0, 0, 0.55)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
  },

  modalLabel: {
    color: "#68738d",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.6px",
    marginBottom: 8,
  },

  modalTitle: {
    margin: 0,
    color: "#eef1ff",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    border: "1px solid rgba(126, 139, 180, 0.16)",
    background: "rgba(255,255,255,0.03)",
    color: "#9aa4bb",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
  },

  description: {
    margin: "20px 0 0",
    color: "#8b95ac",
    fontSize: 14,
    lineHeight: 1.7,
  },

  features: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
    marginTop: 24,
  },

  feature: {
    display: "flex",
    gap: 13,
    padding: 15,
    borderRadius: 12,
    border: "1px solid rgba(126, 139, 180, 0.12)",
    background: "rgba(255,255,255,0.025)",
  },

  featureDot: {
    width: 8,
    height: 8,
    flexShrink: 0,
    marginTop: 5,
    borderRadius: "50%",
    background: "#64e6ff",
    boxShadow: "0 0 10px rgba(100, 230, 255, 0.55)",
  },

  featureTitle: {
    margin: 0,
    color: "#e8ecf8",
    fontSize: 14,
    fontWeight: 650,
  },

  featureText: {
    margin: "5px 0 0",
    color: "#737e97",
    fontSize: 12,
    lineHeight: 1.5,
  },

  techSection: {
    marginTop: 26,
    paddingTop: 22,
    borderTop: "1px solid rgba(126, 139, 180, 0.12)",
  },

  techList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  techListSpan: {
    display: "inline-block",
  },

  closePrimary: {
    width: "100%",
    marginTop: 26,
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(100, 230, 255, 0.2)",
    background: "rgba(100, 230, 255, 0.08)",
    color: "#64e6ff",
    fontSize: 13,
    fontWeight: 650,
    cursor: "pointer",
  },
};