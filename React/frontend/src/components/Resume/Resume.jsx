import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Resume.css";

const API_URL = "https://portfolio-api-rose.vercel.app";
const RESUME_PATH = "/Mahmoud_Ahmed El-Sharaky_Resume.pdf";

function Resume() {
    const [downloading, setDownloading] = useState(false);

    async function handleDownload() {
        setDownloading(true);

        // Notify backend (fire-and-forget)
        try {
            await axios.post(`${API_URL}/resume-downloaded`, {
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.error("Notification failed:", err);
        }

        // Trigger the actual download
        const link = document.createElement("a");
        link.href = RESUME_PATH;
        link.download = "Mahmoud_Alshraky_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => setDownloading(false), 2000);
    }

    return (
        <motion.section
            className="resume-section"
            id="Resume"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
        >
            <div className="resume-card">
                <motion.div
                    className="resume-icon"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </motion.div>

                <h2 className="resume-title">السيرة الذاتية</h2>
                <p className="resume-subtitle">
                    حمّل سيرتي الذاتية للاطلاع على خبراتي ومهاراتي بالتفصيل
                </p>

                <motion.button
                    className={`resume-btn ${downloading ? "downloaded" : ""}`}
                    onClick={handleDownload}
                    disabled={downloading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {downloading ? (
                        <>
                            <svg
                                className="check-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            تم التحميل!
                        </>
                    ) : (
                        <>
                            <svg
                                className="download-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            تحميل السيرة الذاتية
                        </>
                    )}
                </motion.button>
            </div>
        </motion.section>
    );
}

export default Resume;
