"use client";
/**
 * ContactPanel.tsx — Gmail-inspired mail compose interface with EmailJS.
 * Sends emails to udeshipratham@gmail.com via EmailJS.
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// ──────────────────────────────────────────────────────────
// 🔑  Fill in your EmailJS credentials here:
const EMAILJS_SERVICE_ID = "service_yi4xchr"; // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = "template_kgicdda"; // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY = "ND7GLIaFXEQQiNLkx"; // e.g. 'abcDEFghiJKL'
// ──────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const canSend =
    fromName.trim() && fromEmail.trim() && subject.trim() && message.trim();

  const handleSend = async () => {
    if (!canSend || status === "sending") return;
    setStatus("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: fromName,
          from_email: fromEmail,
          to_email: "udeshipratham@gmail.com",
          subject: subject,
          message: message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("sent");
      // Reset after a moment
      setTimeout(() => {
        setFromName("");
        setFromEmail("");
        setSubject("");
        setMessage("");
        setStatus("idle");
      }, 3500);
    } catch (err) {
      console.error("[emailjs]", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    padding: "8px 0",
    fontFamily: '"Inter", sans-serif',
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    color: "#475569",
    fontFamily: '"JetBrains Mono", monospace',
    letterSpacing: 0.8,
    textTransform: "uppercase",
    flexShrink: 0,
    width: 44,
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
    padding: "2px 12px",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Inter", sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Header bar (Gmail-style) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px 8px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>✉️</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
            New Message
          </span>
        </div>
        <div
          style={{ display: "flex", gap: 6, fontSize: 11, color: "#64748b" }}
        >
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              background: "rgba(130, 140, 248, 0.06)",
              border: "1px solid rgba(130,140,248,0.12)",
              color: "var(--accent)",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
            }}
          >
            Encrypted · Secure
          </span>
        </div>
      </div>

      {/* ── To field (fixed, non-editable) ── */}
      <div style={rowStyle}>
        <span style={labelStyle}>To</span>
        <div
          style={{
            flex: 1,
            padding: "8px 0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              background: "rgba(130, 140, 248, 0.12)",
              border: "1px solid rgba(130, 140, 248, 0.2)",
              borderRadius: 20,
              padding: "3px 12px",
              fontSize: 12,
              color: "#a5b4fc",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 10 }}>●</span>
            udeshipratham@gmail.com
          </span>
          <span style={{ fontSize: 10, color: "#1e293b", marginLeft: 4 }}>
            🔒
          </span>
        </div>
      </div>

      {/* ── From name ── */}
      <div style={rowStyle}>
        <span style={labelStyle}>Name</span>
        <input
          style={inputStyle}
          placeholder="Your name"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
        />
      </div>

      {/* ── From email ── */}
      <div style={rowStyle}>
        <span style={labelStyle}>From</span>
        <input
          style={inputStyle}
          type="email"
          placeholder="Your email address"
          value={fromEmail}
          onChange={(e) => setFromEmail(e.target.value)}
        />
      </div>

      {/* ── Subject ── */}
      <div style={rowStyle}>
        <span style={labelStyle}>Subj</span>
        <input
          style={{ ...inputStyle, fontWeight: 500 }}
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          padding: "12px 12px 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <textarea
          style={{
            flex: 1,
            width: "100%",
            background: "transparent",
            border: "none",
            color: "#e2e8f0",
            fontSize: 13,
            outline: "none",
            resize: "none",
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.7,
            boxSizing: "border-box",
          }}
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* ── Toolbar / Send ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.04)",
          flexShrink: 0,
        }}
      >
        {/* Char count */}
        <span
          style={{
            fontSize: 10,
            color: "#334155",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {message.length} chars
        </span>

        {/* Send button */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend || status === "sending"}
          whileHover={canSend && status === "idle" ? { scale: 1.03 } : {}}
          whileTap={canSend && status === "idle" ? { scale: 0.97 } : {}}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            borderRadius: 10,
            border: "none",
            background:
              !canSend || status === "sending"
                ? "rgba(255, 255, 255, 0.05)"
                : "linear-gradient(135deg, var(--accent-mid), var(--accent))",
            color: !canSend || status === "sending" ? "#475569" : "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor:
              !canSend || status === "sending" ? "not-allowed" : "pointer",
            transition: "all 0.25s",
            boxShadow:
              canSend && status === "idle"
                ? "0 4px 20px rgba(99,102,241,0.3)"
                : "none",
          }}
        >
          {status === "sending" ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ display: "inline-block", fontSize: 14 }}
              >
                ⟳
              </motion.span>
              Sending...
            </>
          ) : (
            <>
              <span style={{ fontSize: 14 }}>➤</span>
              Send
            </>
          )}
        </motion.button>
      </div>

      {/* ── Status toasts ── */}
      <AnimatePresence>
        {status === "sent" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "absolute",
              bottom: 60,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              color: "#86efac",
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            ✓ Message sent successfully!
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "absolute",
              bottom: 60,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            ✕ Failed to send — check EmailJS config
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
