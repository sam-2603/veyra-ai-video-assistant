import { useState } from "react";
import SyncAnalysis from "../components/SyncAnalysis";
import SummaryCard from "../components/SummaryCard";
import ActionItems from "../components/ActionItems";
import Decisions from "../components/Decisions";
import Questions from "../components/Questions";
import Transcript from "../components/Transcript";
import Chat from "../components/Chat";

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: "overview",
  },
  {
    id: "transcript",
    label: "Transcript",
    icon: "transcript",
  },
  {
    id: "actions",
    label: "Action Items",
    icon: "actions",
  },
  {
    id: "decisions",
    label: "Decisions",
    icon: "decisions",
  },
  {
    id: "questions",
    label: "Questions",
    icon: "questions",
  },
  {
    id: "chat",
    label: "AI Chat",
    icon: "chat",
  },
];

export default function Results({ result }) {
  const [tab, setTab] = useState("overview");

  return (
    <div style={styles.page}>
      {/* Background glow */}
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <main style={styles.wrap}>
        {/* Result Header */}
        <section style={styles.hero}>
          <div style={styles.statusRow}>
            <div style={styles.status}>
              <span style={styles.statusDot}></span>
              ANALYSIS COMPLETE
            </div>

            <div style={styles.statusLine}></div>

            <span style={styles.statusText}>
              Veyra Media Intelligence
            </span>
          </div>

          <h1 style={styles.title}>
            {result.title}
          </h1>

          <p style={styles.description}>
            Your recording has been processed across audio,
            speech, visual movement, and synchronization signals.
          </p>

          {/* Metadata */}
          <div style={styles.metaRow}>
            <MetaCard
              icon="audio"
              label="AUDIO"
              value="Analyzed"
            />

            <MetaCard
              icon="video"
              label="VIDEO"
              value="Analyzed"
            />

            <MetaCard
              icon="sync"
              label="SYNC"
              value="Measured"
            />

            <MetaCard
              icon="ai"
              label="INTELLIGENCE"
              value="Ready"
            />
          </div>
        </section>

        {/* Navigation */}
        <div style={styles.tabsOuter}>
          <div style={styles.tabs}>
            {TABS.map((item) => {
              const active = tab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  style={{
                    ...styles.tab,
                    ...(active ? styles.tabActive : {}),
                  }}
                >
                  <Icon
                    type={item.icon}
                    active={active}
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <section style={styles.content}>
          {tab === "overview" && (
            <div style={styles.stack}>
              {/* Sync Intelligence */}
              <div style={styles.sectionHeading}>
                <div>
                  <div style={styles.sectionLabel}>
                    SIGNAL INTELLIGENCE
                  </div>

                  <h2 style={styles.sectionTitle}>
                    Audio-visual analysis
                  </h2>
                </div>

                <div style={styles.liveBadge}>
                  <span></span>
                  COMPLETE
                </div>
              </div>

              <SyncAnalysis
                syncAnalysis={result.sync_analysis}
              />

              <div style={styles.grid}>
                <SummaryCard
                  summary={result.summary}
                />

                <ActionItems
                  actionItems={result.action_items}
                />
              </div>

              <div style={styles.grid}>
                <Decisions
                  decisions={result.key_decisions}
                />

                <Questions
                  questions={result.open_questions}
                />
              </div>
            </div>
          )}

          {tab === "transcript" && (
            <GlassSection
              label="TRANSCRIPT"
              title="Full recording transcript"
              icon="transcript"
            >
              <Transcript
                transcript={result.transcript}
              />
            </GlassSection>
          )}

          {tab === "actions" && (
            <GlassSection
              label="ACTION ITEMS"
              title="Identified actions"
              icon="actions"
            >
              <ActionItems
                actionItems={result.action_items}
              />
            </GlassSection>
          )}

          {tab === "decisions" && (
            <GlassSection
              label="DECISIONS"
              title="Key decisions detected"
              icon="decisions"
            >
              <Decisions
                decisions={result.key_decisions}
              />
            </GlassSection>
          )}

          {tab === "questions" && (
            <GlassSection
              label="OPEN QUESTIONS"
              title="Questions identified"
              icon="questions"
            >
              <Questions
                questions={result.open_questions}
              />
            </GlassSection>
          )}

          {tab === "chat" && (
            <GlassSection
              label="VEYRA INTELLIGENCE"
              title="Ask about your recording"
              icon="chat"
            >
              <Chat
                sessionId={result.session_id}
              />
            </GlassSection>
          )}
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <span>
            © {new Date().getFullYear()} Samarth Koli · Veyra.
            All rights reserved.
          </span>

          <span>
            AUDIO-VISUAL INTELLIGENCE
          </span>
        </footer>
      </main>

      <style>{`
        @keyframes resultGlow {
          0%, 100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes statusPulse {
          0%, 100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------- */
/* Metadata Card */
/* -------------------------------------------------- */

function MetaCard({ icon, label, value }) {
  return (
    <div style={styles.metaCard}>
      <div style={styles.metaIcon}>
        <Icon type={icon} />
      </div>

      <div>
        <div style={styles.metaLabel}>
          {label}
        </div>

        <div style={styles.metaValue}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* Glass Section */
/* -------------------------------------------------- */

function GlassSection({
  label,
  title,
  icon,
  children,
}) {
  return (
    <div style={styles.glassSection}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionIcon}>
          <Icon type={icon} />
        </div>

        <div>
          <div style={styles.sectionLabel}>
            {label}
          </div>

          <h2 style={styles.sectionTitle}>
            {title}
          </h2>
        </div>
      </div>

      <div style={styles.sectionBody}>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* SVG Icons */
/* -------------------------------------------------- */

function Icon({ type, active }) {
  const color = active
    ? "#64e6ff"
    : "#78839c";

  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "audio") {
    return (
      <svg {...common}>
        <path d="M12 2v20" />
        <path d="M7 6v12" />
        <path d="M17 6v12" />
        <path d="M3 9v6" />
        <path d="M21 9v6" />
      </svg>
    );
  }

  if (type === "video") {
    return (
      <svg {...common}>
        <rect
          x="3"
          y="5"
          width="13"
          height="14"
          rx="2"
        />
        <path d="m16 10 5-3v10l-5-3z" />
      </svg>
    );
  }

  if (type === "sync") {
    return (
      <svg {...common}>
        <path d="M3 12h18" />
        <path d="m8 7-5 5 5 5" />
        <path d="m16 7 5 5-5 5" />
      </svg>
    );
  }

  if (type === "ai") {
    return (
      <svg {...common}>
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <path d="m5.6 5.6 2.1 2.1" />
        <path d="m16.3 16.3 2.1 2.1" />
        <path d="m18.4 5.6-2.1 2.1" />
        <path d="m7.7 16.3-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }

  if (type === "overview") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (type === "transcript") {
    return (
      <svg {...common}>
        <path d="M5 4h14" />
        <path d="M5 9h14" />
        <path d="M5 14h10" />
        <path d="M5 19h7" />
      </svg>
    );
  }

  if (type === "actions") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  if (type === "decisions") {
    return (
      <svg {...common}>
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    );
  }

  if (type === "questions") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.25c-1.2.75-1.7 1.25-1.7 2.25" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg {...common}>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2 1.5-4A7.5 7.5 0 1 1 20 11.5z" />
        <path d="M8 11h.01" />
        <path d="M12 11h.01" />
        <path d="M16 11h.01" />
      </svg>
    );
  }

  return null;
}

/* -------------------------------------------------- */
/* Styles */
/* -------------------------------------------------- */

const styles = {
  page: {
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    overflow: "hidden",
    background: "var(--bg-primary)",
  },

  glowOne: {
    position: "fixed",
    width: 500,
    height: 500,
    top: 80,
    left: "15%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(100,230,255,0.055), transparent 68%)",
    pointerEvents: "none",
    animation: "resultGlow 5s ease-in-out infinite",
  },

  glowTwo: {
    position: "fixed",
    width: 500,
    height: 500,
    top: 280,
    right: "10%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(140,124,255,0.055), transparent 68%)",
    pointerEvents: "none",
    animation: "resultGlow 6s ease-in-out infinite",
  },

  wrap: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "52px 28px 70px",
    boxSizing: "border-box",
  },

  hero: {
    marginBottom: 38,
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#64e6ff",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.4px",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#64e6ff",
    boxShadow:
      "0 0 10px rgba(100,230,255,0.8)",
    animation:
      "statusPulse 1.8s ease-in-out infinite",
  },

  statusLine: {
    width: 30,
    height: 1,
    background:
      "rgba(126,139,180,0.18)",
  },

  statusText: {
    color: "#56617a",
    fontSize: 9,
    letterSpacing: "0.8px",
  },

  title: {
    maxWidth: 850,
    margin: 0,
    color: "#f0f3ff",
    fontSize: "clamp(30px, 4vw, 48px)",
    lineHeight: 1.1,
    letterSpacing: "-1.8px",
    fontWeight: 720,
  },

  description: {
    maxWidth: 680,
    margin: "15px 0 0",
    color: "#77829b",
    fontSize: 14,
    lineHeight: 1.65,
  },

  metaRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: 10,
    marginTop: 27,
  },

  metaCard: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: 13,
    borderRadius: 13,
    border:
      "1px solid rgba(126,139,180,0.12)",
    background:
      "rgba(255,255,255,0.025)",
    backdropFilter: "blur(18px)",
  },

  metaIcon: {
    width: 32,
    height: 32,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    background:
      "rgba(100,230,255,0.055)",
    border:
      "1px solid rgba(100,230,255,0.10)",
  },

  metaLabel: {
    color: "#59647c",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "1.2px",
  },

  metaValue: {
    marginTop: 3,
    color: "#dce1f1",
    fontSize: 12,
    fontWeight: 600,
  },

  tabsOuter: {
    position: "sticky",
    top: 72,
    zIndex: 5,
    padding: "10px 0",
    marginBottom: 28,
    background:
      "linear-gradient(to bottom, var(--bg-primary) 65%, transparent)",
  },

  tabs: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: 5,
    borderRadius: 14,
    border:
      "1px solid rgba(126,139,180,0.13)",
    background:
      "rgba(14,19,31,0.78)",
    backdropFilter: "blur(20px)",
    boxShadow:
      "0 15px 45px rgba(0,0,0,0.18)",
  },

  tab: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 12px",
    border: "1px solid transparent",
    borderRadius: 10,
    background: "transparent",
    color: "#6f7a93",
    fontSize: 11.5,
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition:
      "all 0.2s ease",
  },

  tabActive: {
    color: "#eaf0ff",
    background:
      "rgba(100,230,255,0.065)",
    border:
      "1px solid rgba(100,230,255,0.12)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.04)",
  },

  content: {
    minHeight: 300,
  },

  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  sectionLabel: {
    color: "#65718b",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.5px",
    marginBottom: 5,
  },

  sectionTitle: {
    margin: 0,
    color: "#e9edf9",
    fontSize: 22,
    fontWeight: 650,
    letterSpacing: "-0.4px",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 10px",
    borderRadius: 999,
    color: "#64e6ff",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "1px",
    border:
      "1px solid rgba(100,230,255,0.13)",
    background:
      "rgba(100,230,255,0.04)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
  },

  glassSection: {
    borderRadius: 18,
    border:
      "1px solid rgba(126,139,180,0.13)",
    background:
      "rgba(15,20,32,0.68)",
    backdropFilter: "blur(20px)",
    overflow: "hidden",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.16)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "20px 22px",
    borderBottom:
      "1px solid rgba(126,139,180,0.09)",
  },

  sectionIcon: {
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    background:
      "linear-gradient(145deg, rgba(100,230,255,0.08), rgba(140,124,255,0.08))",
    border:
      "1px solid rgba(126,139,180,0.13)",
  },

  sectionBody: {
    padding: 0,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 65,
    paddingTop: 20,
    borderTop:
      "1px solid rgba(126,139,180,0.10)",
    color: "#56617a",
    fontSize: 10,
    letterSpacing: "0.3px",
  },
};