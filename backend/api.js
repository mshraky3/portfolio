import express from "express"
import cors from "cors";
import nodemailer from "nodemailer"

const app = express()

// SECURITY: Restrict CORS to your actual domains
const corsOptions = {
    origin: [
        'https://web-dev-seven-iota.vercel.app',
        'https://alshraky.com',
        process.env.ALLOWED_ORIGIN,
    ].filter(Boolean),
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// SECURITY: Credentials loaded from environment variables (set in Vercel dashboard)
const Email = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        tls: true,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    }
)




app.post("/send-email", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        const result = await Email.sendMail({
            from: process.env.EMAIL_USER || "alshrakynodeapp@gmail.com",
            to: `muhmodalshraky3@gmail.com`,
            subject: data.subject || "No Subject Provided",
            text: `Message from ${data.firstName} (${data.email}):\n\n${data.message}`,
        });

        console.log("Email sent:", result);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.get("/api", (req, res) => {
    res.send("app is working")
})




app.listen(3000, () => {
    console.log("app is working")
})

