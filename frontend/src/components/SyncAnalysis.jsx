export default function SyncAnalysis({ syncAnalysis }) {
  if (!syncAnalysis) return null;

  const offset = Number(syncAnalysis.estimated_offset_seconds || 0);
  const correlation = Number(syncAnalysis.correlation || 0);

  const offsetText = `${offset > 0 ? "+" : ""}${offset.toFixed(2)}s`;

  let status = "Measured";
  let statusText = "Audio and visual signals have been compared.";

  if (Math.abs(offset) <= 0.15) {
    status = "Well aligned";
    statusText = "The detected speech and mouth movement are closely aligned.";
  } else if (Math.abs(offset) <= 0.4) {
    status = "Minor offset";
    statusText = "A small timing difference was detected between the signals.";
  } else {
    status = "Noticeable offset";
    statusText =
      "A larger timing difference was detected between speech and mouth movement.";
  }

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <div style={styles.eyebrow}>SIGNAL INTELLIGENCE</div>

          <h2 style={styles.heading}>Audio-visual synchronization</h2>

          <p style={styles.subtitle}>
            Comparing speech activity with detected facial movement.
          </p>
        </div>

        <div style={styles.status}>
          <span style={styles.statusDot} />
          {status}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTop}>
          <div>
            <div style={styles.cardLabel}>SYNC MEASUREMENT</div>

            <div style={styles.statusTitle}>{status}</div>

            <p style={styles.description}>{statusText}</p>
          </div>

          <div style={styles.signalIcon}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div style={styles.metrics}>
          <Metric
            label="Estimated offset"
            value={offsetText}
            description="Difference between detected speech and mouth movement."
          />

          <Metric
            label="Correlation"
            value={correlation.toFixed(4)}
            description="Similarity between the two detected activity signals."
          />
        </div>

        <div style={styles.footer}>
          <div>
            <span style={styles.footerLabel}>ANALYSIS METHOD</span>
            <span style={styles.footerValue}>
              Audio activity + facial movement
            </span>
          </div>

          <div>
            <span style={styles.footerLabel}>STATUS</span>
            <span style={styles.footerValue}>Analysis complete</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, description }) {
  return (
    <div style={styles.metric}>
      <div style={styles.metricLabel}>{label}</div>

      <div style={styles.metricValue}>{value}</div>

      <div style={styles.metricDescription}>{description}</div>
    </div>
  );
}

const styles = {
  section: {
    width: "100%",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "var(--text-secondary)",
    marginBottom: 7,
  },

  heading: {
    margin: 0,
    fontSize: 22,
    fontWeight: 650,
    letterSpacing: "-0.4px",
  },

  subtitle: {
    margin: "7px 0 0",
    fontSize: 13,
    color: "var(--text-secondary)",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 11px",
    borderRadius: 999,
    border: "1px solid rgba(74, 211, 255, 0.25)",
    background: "rgba(74, 211, 255, 0.06)",
    color: "#59d8ff",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.8px",
    whiteSpace: "nowrap",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#59d8ff",
    boxShadow: "0 0 9px rgba(89, 216, 255, 0.8)",
  },

  card: {
    border: "1px solid var(--border-soft)",
    borderRadius: 18,
    background:
      "linear-gradient(135deg, rgba(20, 27, 40, 0.96), rgba(12, 16, 24, 0.98))",
    overflow: "hidden",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    padding: "25px 26px 22px",
    borderBottom: "1px solid var(--border-soft)",
  },

  cardLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.4px",
    color: "var(--text-secondary)",
    marginBottom: 7,
  },

  statusTitle: {
    fontSize: 19,
    fontWeight: 650,
    color: "var(--text-primary)",
  },

  description: {
    margin: "6px 0 0",
    maxWidth: 560,
    fontSize: 13,
    lineHeight: 1.5,
    color: "var(--text-secondary)",
  },

  signalIcon: {
    width: 110,
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    flexShrink: 0,
  },

  signalIconSpan: {},

  metrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 0,
  },

  metric: {
    padding: "24px 26px",
    minHeight: 135,
    boxSizing: "border-box",
  },

  metricLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.2px",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  metricValue: {
    fontSize: 34,
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: "-1px",
    color: "var(--text-primary)",
    marginBottom: 12,
  },

  metricDescription: {
    maxWidth: 330,
    fontSize: 12,
    lineHeight: 1.5,
    color: "var(--text-secondary)",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    padding: "17px 26px",
    borderTop: "1px solid var(--border-soft)",
    background: "rgba(255,255,255,0.015)",
  },

  footerLabel: {
    display: "block",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.2px",
    color: "var(--text-secondary)",
    marginBottom: 5,
  },

  footerValue: {
    display: "block",
    fontSize: 11.5,
    color: "var(--text-primary)",
  },
};