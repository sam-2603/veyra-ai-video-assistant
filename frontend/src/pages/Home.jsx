import VideoInput from "../components/VideoInput";
import ProcessingState from "../components/ProcessingState";

export default function Home({ onSubmit, loading, error }) {
  return (
    <div style={styles.wrap}>
      <section style={styles.hero}>
        <h1 style={styles.h1}>Turn videos into knowledge.</h1>
        <p style={styles.sub}>
          Drop in a video or audio recording. Get a transcript, summary,
          action items, decisions, and open questions — then ask
          your video anything.
        </p>
      </section>

      <div style={styles.formArea}>
        {loading ? (
          <ProcessingState />
        ) : (
          <>
            <VideoInput onSubmit={onSubmit} disabled={loading} />
            {error && (
              <div style={styles.errorBox}>
                <strong style={{ color: "var(--danger)" }}>Something went wrong.</strong>
                <p style={{ marginTop: 4 }}>{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "72px 24px 100px",
  },
  hero: {
    maxWidth: 620,
    textAlign: "center",
    marginBottom: 44,
  },
  h1: {
    fontSize: "clamp(32px, 5vw, 48px)",
    lineHeight: 1.1,
    marginBottom: 16,
  },
  sub: {
    fontSize: 16.5,
  },
  formArea: {
    width: "100%",
    maxWidth: 460,
  },
  errorBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 10,
    background: "var(--danger-soft)",
    border: "1px solid rgba(226,113,107,0.3)",
  },
};
