"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import EarthCanvas from "../3d/EarthCanvas";

const slideIn = (direction: string, delay: number, duration: number) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "tween" as const, delay, duration, ease: "easeOut" as const },
  },
});

/**
 * M3 floating label text field wrapper.
 * Renders a surface-container-highest input with animated underline indicator.
 */
function M3Field({
  label, name, value, onChange, type = "text", placeholder, rows,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string; placeholder?: string; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const Tag = rows ? "textarea" : "input";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Supporting label above */}
      <span style={{
        fontFamily: "var(--md-font-body)",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.4px",
        color: focused ? "var(--md-primary)" : "var(--md-on-surface-variant)",
        transition: "color 0.2s",
        marginBottom: 4,
      }}>
        {label}
      </span>

      <div style={{ position: "relative" }}>
        {/* @ts-ignore — Tag is dynamic */}
        <Tag
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          className="m3-text-field"
          style={{
            resize: rows ? "none" : undefined,
            borderBottomColor: focused ? "var(--md-primary)" : "var(--md-outline)",
            borderBottomWidth: focused ? 2 : 1,
          }}
        />
        {/* Active indicator line animation */}
        <div style={{
          position: "absolute",
          bottom: 0, left: "50%",
          width: focused ? "100%" : "0%",
          height: 2,
          background: "var(--md-primary)",
          transform: "translateX(-50%)",
          transition: "width 0.25s ease",
          borderRadius: "0 0 var(--md-shape-xs) var(--md-shape-xs)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form,    setForm]    = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_yi4xchr",
        "template_kgicdda",
        { from_name: form.name, to_name: "Pratham Udeshi", from_email: form.email, to_email: "udeshipratham@gmail.com", message: form.message },
        "ND7GLIaFXEQQiNLkx",
      )
      .then(() => {
        setLoading(false);
        alert("Thank you. I will get back to you as soon as possible.");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
        alert("Ahh, something went wrong. Please try again.");
      });
  };

  return (
    <section id="contact" className="portfolio-section" style={{ padding: "96px 24px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Section header */}
        <p className="m3-label-sm">Get in touch</p>
        <h2 className="m3-title-lg" style={{ marginTop: 8, marginBottom: 48 }}>Contact.</h2>

        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          flexWrap: "wrap-reverse",
          alignItems: "flex-start",
        }} className="xl:flex-row flex-col-reverse">

          {/* M3 form card */}
          <motion.div
            variants={slideIn("left", 0.2, 0.9)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="m3-card-elevated"
            style={{ flex: "0.7 1 340px", padding: "32px 28px" }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <M3Field label="Your Name"    name="name"    value={form.name}    onChange={handleChange} placeholder="What's your name?" />
                <M3Field label="Your Email"   name="email"   value={form.email}   onChange={handleChange} type="email" placeholder="your@email.com" />
                <M3Field label="Your Message" name="message" value={form.message} onChange={handleChange} placeholder="What would you like to say?" rows={7} />

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="m3-btn-filled"
                  >
                    {loading ? "Sending…" : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Earth canvas */}
          <motion.div
            variants={slideIn("right", 0.2, 0.9)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ flex: 1, height: "clamp(340px, 48vh, 540px)", minWidth: 280 }}
          >
            <EarthCanvas />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1280px) {
          .flex-col-reverse { flex-direction: row !important; }
        }
      `}</style>
    </section>
  );
}
