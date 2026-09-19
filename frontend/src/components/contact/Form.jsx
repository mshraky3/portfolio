import { useState } from "react";
import axios from "axios";

const API_URL = "https://portfolio-api-rose.vercel.app";
const EMPTY = { firstName: "", email: "", subject: "", message: "" };

export default function Form() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post(`${API_URL}/send-email`, values);
      setStatus("sent");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        <span>Name</span>
        <input name="firstName" type="text" autoComplete="name" maxLength={100} required value={values.firstName} onChange={onChange} />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required value={values.email} onChange={onChange} />
      </label>
      <label>
        <span>Subject</span>
        <input name="subject" type="text" maxLength={200} required value={values.subject} onChange={onChange} />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={5} maxLength={5000} required value={values.message} onChange={onChange} />
      </label>

      <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      <p className="form-status" role="status" data-state={status}>
        {status === "sent" && "Thanks, your message arrived. I will reply to your email soon."}
        {status === "error" && "The message did not send. Try again, or email me directly at the address on this page."}
      </p>
    </form>
  );
}
