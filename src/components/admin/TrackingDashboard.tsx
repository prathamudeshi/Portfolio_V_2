"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeColors } from "@/hooks/useThemeColors";
import { logoutAction } from "@/app/admin/login/actions";
import { useRouter } from "next/navigation";

interface Session {
  visitorId: string;
  userAgent: string;
  language: string;
  screenResolution: string;
  referrer: string;
  lastSeen: string;
  firstSeen: string;
}

interface Snapshot {
  _id: string;
  visitorId: string;
  snapshot: string;
  trackingState: any;
  timestamp: string;
  path: string;
}

export default function TrackingDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  
  // New States for Selection, Download & Delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const colors = useThemeColors();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setSessions(data.sessions || []);
      setSnapshots(data.snapshots || []);
    } catch (err) {
      console.error("[Dashboard] Fetch fail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredSnapshots = selectedSession
    ? snapshots.filter((s) => s.visitorId === selectedSession)
    : snapshots;

  // Selection Helpers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const visibleIds = filteredSnapshots.map((s) => s._id);
    setSelectedIds(visibleIds);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleDownloadSelected = () => {
    if (selectedIds.length === 0) return;
    const selectedSnapshots = snapshots.filter((s) => selectedIds.includes(s._id));
    
    selectedSnapshots.forEach((snap, index) => {
      const link = document.createElement("a");
      link.href = snap.snapshot;
      const timeStr = new Date(snap.timestamp).toISOString().replace(/[:.]/g, "-");
      link.download = `nexus_snapshot_${snap.visitorId.slice(0, 6)}_${timeStr}.jpg`;
      
      // Delay downloads slightly to avoid browser pop-up blocking
      setTimeout(() => {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        setSnapshots((prev) => prev.filter((s) => !selectedIds.includes(s._id)));
        setSelectedIds([]);
        setShowConfirmModal(false);
      } else {
        alert("Failed to delete snapshots.");
      }
    } catch (err) {
      console.error("[Dashboard] Delete fail:", err);
      alert("Error deleting snapshots.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        LOADING_DECRYPTING_TELEMETRY...
      </div>
    );

  return (
    <div
      style={{
        height: "100vh",
        background: "#05050f",
        color: "#cbd5e1",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(10, 10, 20, 0.5)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-mid))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            👁️
          </div>
          <div>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
                color: "#fff",
              }}
            >
              Nexus Telemetry
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "var(--accent)",
                margin: 0,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              SECRET_HOSPITALITY_PROTOCOL_v0.92
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12, alignItems: "center" }}>
          <div>
            SESSIONS:{" "}
            <span style={{ color: "var(--accent)" }}>{sessions.length}</span>
          </div>
          <div>
            SNAPSHOTS:{" "}
            <span style={{ color: "var(--accent)" }}>{snapshots.length}</span>
          </div>
          <button
            onClick={fetchData}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: 18,
            }}
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: 18,
            }}
            title="Logout"
          >
            🚪
          </button>
        </div>
      </header>

      <main style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar: Sessions */}
        <aside
          style={{
            width: 320,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            overflowY: "auto",
            background: "rgba(5, 5, 10, 0.3)",
          }}
        >
          <div
            style={{
              padding: "20px",
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Recent Sessions
          </div>
          {sessions.map((session) => (
            <div
              key={session.visitorId}
              onClick={() => {
                setSelectedSession(
                  selectedSession === session.visitorId
                    ? null
                    : session.visitorId,
                );
                setSelectedIds([]); // Clear selection when changing/clearing session filter
              }}
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.02)",
                cursor: "pointer",
                background:
                  selectedSession === session.visitorId
                    ? "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.08)"
                    : "transparent",
                borderLeft:
                  selectedSession === session.visitorId
                    ? "3px solid var(--accent)"
                    : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    selectedSession === session.visitorId ? "#fff" : "#94a3b8",
                }}
              >
                {session.visitorId.slice(0, 12)}...
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>
                {new Date(session.lastSeen).toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "var(--accent)",
                  marginTop: 4,
                  opacity: 0.7,
                }}
              >
                {session.referrer.includes("linkedin")
                  ? "🔗 LinkedIn"
                  : "🌐 Web"}{" "}
                • {session.screenResolution}
              </div>
            </div>
          ))}
        </aside>

        {/* Content: Snapshot Gallery */}
        <section style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
          {/* Sub-toolbar for Multi-Select Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
                {selectedSession
                  ? `Session: ${selectedSession.slice(0, 8)}...`
                  : "Visual Telemetry Log"}
              </h2>
              {filteredSnapshots.length > 0 && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleSelectAll}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  >
                    Select All ({filteredSnapshots.length})
                  </button>
                  {selectedIds.length > 0 && (
                    <button
                      onClick={handleDeselectAll}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent)",
                        fontSize: 11,
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                    >
                      Deselect All
                    </button>
                  )}
                </div>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleDownloadSelected}
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    border: "none",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  📥 Download ({selectedIds.length})
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                    border: "none",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  🗑️ Delete ({selectedIds.length})
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredSnapshots.map((snapshot) => (
                <motion.div
                  key={snapshot._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: selectedIds.includes(snapshot._id)
                      ? "2px solid var(--accent)"
                      : "1px solid rgba(255,255,255,0.05)",
                    position: "relative",
                    cursor: "pointer",
                    boxShadow: selectedIds.includes(snapshot._id)
                      ? "0 0 16px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)"
                      : "none",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => toggleSelect(snapshot._id)}
                >
                  {/* Select Checkbox Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: selectedIds.includes(snapshot._id)
                        ? "var(--accent)"
                        : "rgba(5, 5, 10, 0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#fff",
                      fontWeight: "bold",
                      zIndex: 2,
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    {selectedIds.includes(snapshot._id) ? "✓" : ""}
                  </div>

                  <img
                    src={snapshot.snapshot}
                    alt="Webcam capture"
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      padding: "12px",
                      fontSize: 10,
                      background: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "var(--accent)" }}>
                        {new Date(snapshot.timestamp).toLocaleTimeString()}
                      </span>
                      <span style={{ color: "#475569" }}>{snapshot.path}</span>
                    </div>
                    <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                      {snapshot.trackingState.faceDetected && (
                        <span
                          style={{
                            background: "rgba(52, 211, 153, 0.1)",
                            color: "#34d399",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          👤 FACE
                        </span>
                      )}
                      {snapshot.trackingState.handDetected && (
                        <span
                          style={{
                            background: "rgba(129, 140, 248, 0.1)",
                            color: "#818cf8",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          🤚 HAND
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(5, 5, 15, 0.8)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                width: "100%",
                maxWidth: 400,
                background: "rgba(15, 15, 30, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: "24px 30px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(239, 68, 68, 0.1)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  marginBottom: 15,
                }}
              >
                ⚠️
              </div>
              <h3
                style={{
                  margin: "0 0 10px 0",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Confirm Bulk Deletion
              </h3>
              <p
                style={{
                  margin: "0 0 24px 0",
                  color: "#94a3b8",
                  fontSize: 13,
                  lineHeight: "1.5",
                }}
              >
                Are you sure you want to permanently delete these{" "}
                <strong style={{ color: "var(--accent)" }}>{selectedIds.length}</strong> selected
                snapshots? This action cannot be undone.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={deleting}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#cbd5e1",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "8px 20px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                    border: "none",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "8px 20px",
                    borderRadius: 8,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
