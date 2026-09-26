import VideoInput from "../components/VideoInput";
import ProcessingState from "../components/ProcessingState";

export default function Home({ onSubmit, loading, error }) {
  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.eyebrow}>
          <span style={styles.liveDot}></span>
          AUDIO · VIDEO · INTELLIGENCE
        </div>

        <h1 style={styles.title}>
          Analyze your media.
          <br />
          <span style={styles.gradientText}>
            Understand what happens.
          </span>
        </h1>

        <p style={styles.subtitle}>
          Upload an audio or video recording and let the system analyze
          speech activity, facial movement, and audio-visual synchronization.
        </p>
      </section>

      {/* Main Analyzer */}
      <section style={styles.analyzer}>
        <div style={styles.analyzerTop}>
          <div>
            <div style={styles.label}>MEDIA ANALYSIS</div>

            <h2 style={styles.analyzerTitle}>
              Start a new analysis
            </h2>
          </div>

          <div style={styles.engineStatus}>
            <span style={styles.statusDot}></span>
            ENGINE READY
          </div>
        </div>

        {loading ? (
          <ProcessingState />
        ) : (
          <>
            <VideoInput
              onSubmit={onSubmit}
              disabled={loading}
            />

            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorTitle}>
                  Analysis failed
                </div>

                <div style={styles.errorText}>
                  {error}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Analysis Pipeline */}
      <section style={styles.pipelineSection}>
        <div style={styles.pipelineHeader}>
          <div>
            <div style={styles.label}>
              ANALYSIS PIPELINE
            </div>

            <h2 style={styles.pipelineTitle}>
              From media to measurable signals
            </h2>
          </div>
        </div>

        <div style={styles.pipeline}>
          <PipelineStep
            number="01"
            title="Audio"
            description="Extract and process the audio stream."
            symbol="◒"
          />

          <div style={styles.connector}></div>

          <PipelineStep
            number="02"
            title="Speech Activity"
            description="Identify active speech regions."
            symbol="≈"
          />

          <div style={styles.connector}></div>

          <PipelineStep
            number="03"
            title="Face & Mouth"
            description="Track facial and mouth movement."
            symbol="◉"
          />

          <div style={styles.connector}></div>

          <PipelineStep
            number="04"
            title="Sync Analysis"
            description="Compare both signals over time."
            symbol="⇄"
          />
        </div>
      </section>

      {/* Technical Information */}
      <section style={styles.techGrid}>
        <TechCard
          title="COMPUTER VISION"
          value="MediaPipe"
          description="Facial landmark detection and mouth movement analysis."
        />

        <TechCard
          title="AUDIO ANALYSIS"
          value="WebRTC VAD"
          description="Speech activity detection from the extracted audio stream."
        />

        <TechCard
          title="SIGNAL PROCESSING"
          value="Correlation"
          description="Temporal comparison of audio and visual activity."
        />
      </section>

      {/* Project Information */}
      <section style={styles.footerInfo}>
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>SUPPORTED MEDIA</span>
          <p style={styles.footerText}>
            MP4 · MOV · MKV · WEBM · MP3 · WAV · M4A
          </p>
        </div>

        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>OUTPUT</span>
          <p style={styles.footerText}>
            Sync Offset · Correlation · Analysis Report
          </p>
        </div>

        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>PROCESSING</span>
          <p style={styles.footerText}>
            Computer Vision + Audio Signal Processing
          </p>
        </div>
      </section>

      {/* Copyright */}
      <footer style={styles.copyright}>
        <span>
          © {new Date().getFullYear()} Samarth Koli · Veyra. All rights reserved.
        </span>

        <span>
          Audio-Visual Intelligence
        </span>
      </footer>
    </div>
  );
}

function PipelineStep({
  number,
  title,
  description,
  symbol,
}) {
  return (
    <div style={styles.pipelineStep}>
      <div style={styles.pipelineNumber}>
        {number}
      </div>

      <div style={styles.symbol}>
        {symbol}
      </div>

      <h3 style={styles.stepTitle}>
        {title}
      </h3>

      <p style={styles.stepDescription}>
        {description}
      </p>
    </div>
  );
}

function TechCard({
  title,
  value,
  description,
}) {
  return (
    <div style={styles.techCard}>
      <div style={styles.techTitle}>
        {title}
      </div>

      <div style={styles.techValue}>
        {value}
      </div>

      <p style={styles.techDescription}>
        {description}
      </p>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "calc(100vh - 72px)",
    boxSizing: "border-box",
    padding: "76px 28px 40px",
    background:
      "radial-gradient(circle at 50% 0%, rgba(76, 96, 255, 0.12), transparent 34%), var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  hero: {
    width: "100%",
    maxWidth: 900,
    textAlign: "center",
    marginBottom: 58,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(117, 128, 255, 0.28)",
    background: "rgba(80, 91, 220, 0.08)",
    color: "#9da7ff",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.5px",
    marginBottom: 25,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#64e6ff",
    boxShadow:
      "0 0 12px rgba(100, 230, 255, 0.8)",
  },

  title: {
    margin: 0,
    fontSize: "clamp(40px, 6vw, 68px)",
    lineHeight: 1.05,
    letterSpacing: "-2.8px",
    fontWeight: 750,
    color: "#f4f6ff",
  },

  gradientText: {
    background:
      "linear-gradient(90deg, #64e6ff 0%, #8c7cff 55%, #c48cff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    maxWidth: 670,
    margin: "24px auto 0",
    color: "#8992aa",
    fontSize: 16,
    lineHeight: 1.7,
  },

  analyzer: {
    width: "100%",
    maxWidth: 760,
    padding: 26,
    boxSizing: "border-box",
    borderRadius: 20,
    border:
      "1px solid rgba(126, 139, 180, 0.16)",
    background:
      "linear-gradient(145deg, rgba(18, 23, 38, 0.96), rgba(12, 16, 28, 0.96))",
    boxShadow:
      "0 25px 70px rgba(0, 0, 0, 0.28)",
  },

  analyzerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  label: {
    color: "#68738d",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.6px",
    marginBottom: 7,
  },

  analyzerTitle: {
    margin: 0,
    color: "#edf1ff",
    fontSize: 21,
    fontWeight: 650,
  },

  engineStatus: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#7f8aa5",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1px",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#64e6ff",
    boxShadow:
      "0 0 10px rgba(100, 230, 255, 0.7)",
  },

  errorBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 12,
    border:
      "1px solid rgba(255, 100, 120, 0.22)",
    background:
      "rgba(255, 70, 100, 0.06)",
  },

  errorTitle: {
    color: "#ff8798",
    fontSize: 13,
    fontWeight: 650,
    marginBottom: 5,
  },

  errorText: {
    color: "#8992aa",
    fontSize: 13,
    lineHeight: 1.5,
  },

  pipelineSection: {
    width: "100%",
    maxWidth: 1100,
    marginTop: 70,
  },

  pipelineHeader: {
    marginBottom: 22,
  },

  pipelineTitle: {
    margin: 0,
    color: "#e8ebf6",
    fontSize: 23,
    fontWeight: 650,
  },

  pipeline: {
    display: "grid",
    gridTemplateColumns:
      "1fr 28px 1fr 28px 1fr 28px 1fr",
    alignItems: "center",
    gap: 8,
  },

  pipelineStep: {
    minHeight: 185,
    padding: 20,
    boxSizing: "border-box",
    borderRadius: 15,
    border:
      "1px solid rgba(126, 139, 180, 0.14)",
    background:
      "rgba(16, 21, 34, 0.72)",
  },

  pipelineNumber: {
    color: "#68738d",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1px",
  },

  symbol: {
    width: 42,
    height: 42,
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    background:
      "rgba(100, 230, 255, 0.07)",
    border:
      "1px solid rgba(100, 230, 255, 0.13)",
    color: "#64e6ff",
    fontSize: 20,
  },

  stepTitle: {
    margin: "17px 0 7px",
    color: "#e9ecf7",
    fontSize: 15,
    fontWeight: 650,
  },

  stepDescription: {
    margin: 0,
    color: "#727d96",
    fontSize: 12,
    lineHeight: 1.55,
  },

  connector: {
    height: 1,
    background:
      "linear-gradient(90deg, rgba(100,230,255,0.15), rgba(140,124,255,0.5), rgba(100,230,255,0.15))",
  },

  techGrid: {
    width: "100%",
    maxWidth: 1100,
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 14,
    marginTop: 18,
  },

  techCard: {
    padding: 21,
    borderRadius: 14,
    border:
      "1px solid rgba(126, 139, 180, 0.12)",
    background:
      "rgba(13, 18, 30, 0.72)",
  },

  techTitle: {
    color: "#69748d",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.3px",
  },

  techValue: {
    marginTop: 10,
    color: "#9da7ff",
    fontSize: 17,
    fontWeight: 650,
  },

  techDescription: {
    margin: "7px 0 0",
    color: "#727d96",
    fontSize: 12,
    lineHeight: 1.5,
  },

  footerInfo: {
    width: "100%",
    maxWidth: 1100,
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 30,
    marginTop: 60,
    paddingTop: 22,
    borderTop:
      "1px solid rgba(126, 139, 180, 0.12)",
  },

  footerItem: {
    minWidth: 0,
  },

  footerLabel: {
    color: "#59647b",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.3px",
  },

  footerText: {
    margin: "8px 0 0",
    color: "#737e97",
    fontSize: 11,
    lineHeight: 1.5,
  },

  copyright: {
    width: "100%",
    maxWidth: 1100,
    marginTop: 35,
    paddingTop: 20,
    paddingBottom: 10,
    borderTop:
      "1px solid rgba(126, 139, 180, 0.10)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    color: "#59647b",
    fontSize: 11,
    letterSpacing: "0.3px",
  },
};