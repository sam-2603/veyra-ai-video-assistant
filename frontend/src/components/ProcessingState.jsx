import { useEffect, useMemo, useState } from "react";

const STAGES = [
  {
    title: "Preparing media",
    detail: "Extracting and preparing the audio stream",
  },
  {
    title: "Transcribing speech",
    detail: "Converting detected speech into text",
  },
  {
    title: "Generating summary",
    detail: "Building a concise representation of the recording",
  },
  {
    title: "Extracting insights",
    detail: "Identifying actions, decisions and questions",
  },
  {
    title: "Building knowledge base",
    detail: "Preparing the media context for intelligent queries",
  },
  {
    title: "Analyzing synchronization",
    detail: "Comparing speech activity with facial movement",
  },
];

export default function ProcessingState() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((current) =>
        current + 1 < STAGES.length
          ? current + 1
          : current
      );
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(
    ((stageIndex + 1) / STAGES.length) * 100
  );

  const currentStage = STAGES[stageIndex];

  return (
    <div style={styles.wrapper}>
      {/* Animated analysis visual */}
      <div style={styles.visualArea}>
        <div style={styles.outerRing}></div>

        <div style={styles.middleRing}></div>

        <div style={styles.innerRing}>
          <div style={styles.core}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div style={styles.scanLine}></div>

        <div style={styles.percent}>
          {progress}%
        </div>
      </div>

      {/* Current status */}
      <div style={styles.statusArea}>
        <div style={styles.statusBadge}>
          <span style={styles.statusDot}></span>
          ANALYZING MEDIA
        </div>

        <h3 style={styles.currentTitle}>
          {currentStage.title}
        </h3>

        <p style={styles.currentDetail}>
          {currentStage.detail}
        </p>
      </div>

      {/* Animated waveform */}
      <div style={styles.waveform}>
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            key={index}
            style={{
              ...styles.waveBar,
              animationDelay: `${index * 0.045}s`,
              height: `${18 + ((index * 17) % 34)}px`,
            }}
          />
        ))}
      </div>

      {/* Progress */}
      <div style={styles.progressHeader}>
        <span>PROCESSING PIPELINE</span>
        <span>{progress}%</span>
      </div>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Pipeline */}
      <div style={styles.stageList}>
        {STAGES.map((stage, index) => {
          const completed = index < stageIndex;
          const active = index === stageIndex;

          return (
            <div
              key={stage.title}
              style={{
                ...styles.stageItem,
                ...(active ? styles.stageActive : {}),
              }}
            >
              <div
                style={{
                  ...styles.stageIndicator,
                  ...(completed
                    ? styles.stageComplete
                    : active
                    ? styles.stageCurrent
                    : {}),
                }}
              >
                {completed ? "✓" : index + 1}
              </div>

              <div style={styles.stageContent}>
                <div
                  style={{
                    ...styles.stageTitle,
                    color: completed
                      ? "#8e9ab5"
                      : active
                      ? "#eef2ff"
                      : "#566078",
                  }}
                >
                  {stage.title}
                </div>

                {active && (
                  <div style={styles.stageDetail}>
                    {stage.detail}
                  </div>
                )}
              </div>

              {active && (
                <div style={styles.activeIndicator}>
                  <span></span>
                  RUNNING
                </div>
              )}

              {completed && (
                <div style={styles.completeText}>
                  COMPLETE
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer message */}
      <div style={styles.footer}>
        <span style={styles.footerDot}></span>

        Processing locally and through the analysis pipeline.
        Please keep this tab open.
      </div>

      <style>{`
        @keyframes ringRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ringRotateReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulseCore {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-42px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(42px);
            opacity: 0;
          }
        }

        @keyframes waveform {
          0%, 100% {
            transform: scaleY(0.45);
            opacity: 0.45;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(100,230,255,0.15);
          }
          50% {
            box-shadow: 0 0 14px rgba(100,230,255,0.65);
          }
        }

        @keyframes progressGlow {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    padding: "30px 28px 26px",
    boxSizing: "border-box",
    borderRadius: 16,
    background:
      "linear-gradient(145deg, #0f1422, #0b0f18)",
    border:
      "1px solid rgba(126,139,180,0.10)",
  },

  visualArea: {
    width: 110,
    height: 110,
    margin: "0 auto 24px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  outerRing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border:
      "1px dashed rgba(100,230,255,0.30)",
    animation:
      "ringRotate 7s linear infinite",
  },

  middleRing: {
    position: "absolute",
    inset: 10,
    borderRadius: "50%",
    border:
      "1px solid rgba(140,124,255,0.35)",
    borderTopColor: "#64e6ff",
    borderBottomColor: "#8c7cff",
    animation:
      "ringRotateReverse 3.5s linear infinite",
  },

  innerRing: {
    position: "absolute",
    inset: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid rgba(100,230,255,0.15)",
    background:
      "radial-gradient(circle, rgba(100,230,255,0.12), rgba(100,230,255,0.01))",
  },

  core: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    animation: "pulseCore 1.5s ease-in-out infinite",
  },

  scanLine: {
    position: "absolute",
    width: 74,
    height: 1,
    background:
      "linear-gradient(90deg, transparent, #64e6ff, transparent)",
    boxShadow:
      "0 0 8px rgba(100,230,255,0.7)",
    animation:
      "scan 1.8s ease-in-out infinite",
  },

  percent: {
    position: "absolute",
    bottom: -22,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#9da7ff",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1px",
  },

  statusArea: {
    textAlign: "center",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    color: "#64e6ff",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.5px",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#64e6ff",
    boxShadow:
      "0 0 10px rgba(100,230,255,0.8)",
    animation: "glow 1.4s ease-in-out infinite",
  },

  currentTitle: {
    margin: "10px 0 5px",
    color: "#eef2ff",
    fontSize: 19,
    fontWeight: 650,
  },

  currentDetail: {
    margin: 0,
    color: "#77829b",
    fontSize: 12.5,
    lineHeight: 1.5,
  },

  waveform: {
    height: 55,
    margin: "26px auto 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    overflow: "hidden",
  },

  waveBar: {
    width: 3,
    minHeight: 8,
    maxHeight: 45,
    borderRadius: 99,
    background:
      "linear-gradient(to top, #64e6ff, #9d82ff)",
    animation:
      "waveform 1s ease-in-out infinite",
    transformOrigin: "center",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#5e6982",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.2px",
    marginBottom: 8,
  },

  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 99,
    background: "rgba(126,139,180,0.10)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 99,
    background:
      "linear-gradient(90deg, #64e6ff, #8c7cff, #c48cff)",
    boxShadow:
      "0 0 12px rgba(100,230,255,0.4)",
    transition: "width 0.7s ease",
    animation:
      "progressGlow 1.5s ease-in-out infinite",
  },

  stageList: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  stageItem: {
    minHeight: 44,
    padding: "8px 10px",
    boxSizing: "border-box",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    gap: 11,
    border: "1px solid transparent",
    transition:
      "all 0.3s ease",
  },

  stageActive: {
    border:
      "1px solid rgba(100,230,255,0.10)",
    background:
      "rgba(100,230,255,0.035)",
  },

  stageIndicator: {
    width: 25,
    height: 25,
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid rgba(126,139,180,0.14)",
    color: "#515c73",
    fontSize: 9,
    fontWeight: 700,
  },

  stageCurrent: {
    border:
      "1px solid rgba(100,230,255,0.5)",
    background:
      "rgba(100,230,255,0.08)",
    color: "#64e6ff",
    boxShadow:
      "0 0 12px rgba(100,230,255,0.10)",
  },

  stageComplete: {
    border:
      "1px solid rgba(100,230,255,0.18)",
    background:
      "rgba(100,230,255,0.06)",
    color: "#64e6ff",
  },

  stageContent: {
    flex: 1,
    minWidth: 0,
  },

  stageTitle: {
    fontSize: 12.5,
    fontWeight: 600,
    transition: "color 0.3s ease",
  },

  stageDetail: {
    marginTop: 3,
    color: "#626e87",
    fontSize: 10.5,
  },

  activeIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: "#64e6ff",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "0.8px",
  },

  activeIndicatorSpan: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#64e6ff",
  },

  completeText: {
    color: "#53617b",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "0.7px",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 20,
    paddingTop: 17,
    borderTop:
      "1px solid rgba(126,139,180,0.08)",
    color: "#566179",
    fontSize: 10.5,
    textAlign: "center",
  },

  footerDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#8c7cff",
  },
};