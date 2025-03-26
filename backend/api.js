import express from "express"
import cors from "cors";
import nodemailer from "nodemailer"

const app = express()

const corsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
};

app.use(cors(corsOptions));
app.use(express.json());

const Email = nodemailer.createTransport(
    {
        host:"smtp.gmail.com",
        port:587,
        tls:true,
        secure:false,
        auth:{
            user:"alshrakynodeapp@gmail.com",
            pass:"ymfnqdsctolgcfzv",
        }
    }
)




app.post("/send-email", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        const result = await Email.sendMail({
            from: "alshrakynodeapp@gmail.com",
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

app.get("/api" , (req , res)=>{
        res.send("app is working")
})




app.listen(3000, ()=>{
    console.log("app is working")
})

