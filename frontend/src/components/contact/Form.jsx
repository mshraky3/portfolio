import { useState } from "react";
import { sendNote, track } from "../../utils/api";

// A two-field note: what you want to say, and how to reply (email or phone).
export default function Form() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendNote(message.trim(), reply.trim());
      track("contact", "note");
      setStatus("sent");
      setMessage("");
      setReply("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="note" onSubmit={onSubmit} aria-labelledby="note-title">
      <h3 id="note-title">Or leave a quick note</h3>
      <label className="note-field">
        <span className="visually-hidden">Your message</span>
        <textarea
          name="message"
          rows={3}
          maxLength={5000}
          required
          placeholder="Hi Mahmoud, I'd like to talk about..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <div className="note-row">
        <label className="note-field">
          <span className="visually-hidden">Your email or WhatsApp number</span>
          <input
            name="reply"
            type="text"
            inputMode="email"
            autoComplete="email"
            maxLength={200}
            required
            pattern="^([^\s@]+@[^\s@]+\.[^\s@]+|\+?[0-9][0-9\s\-]{6,19})$"
            title="An email address or a phone number"
            placeholder="Your email or WhatsApp number"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send"}
        </button>
      </div>
      <p className="note-status" role="status" data-state={status}>
        {status === "sent" && "Got it. I'll get back to you soon."}
        {status === "error" && "That didn't send. Try WhatsApp or email instead."}
      </p>
    </form>
  );
}
