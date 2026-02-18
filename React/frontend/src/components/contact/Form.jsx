import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

function Form() {
    const [formData, setFormData] = useState({});
    const [buttonText, setButtonText] = useState("أرسل الآن");
    const [buttonColor, setButtonColor] = useState("");
    function addForm(e) {
        const { id: name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setButtonText("جاري الإرسال — أستجيب قريبًا...");
            setButtonColor("");

            const response = await axios.post('https://portfolio-api-rose.vercel.app/send-email', formData);

            if (response.status === 200) {
                setButtonText("تم الإرسال! سأتواصل قريبًا");
                setButtonColor("green");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setButtonText("فشل الإرسال — حاول مرة أخرى");
            setButtonColor("red");
        }
    }

    return (
        <>
            <form className="ContactFormInputs" onSubmit={handleSubmit}>
                <div className="InputRow">
                    <label htmlFor="firstName">الاسم</label>
                    <input
                        type="text"
                        id="firstName"
                        onChange={addForm}
                        placeholder="الاسم *"
                        required
                    />
                </div>
                <div className="InputRow">
                    <label htmlFor="email">البريد الإلكتروني</label>
                    <input
                        type="email"
                        id="email"
                        onChange={addForm}
                        placeholder="البريد الإلكتروني *"
                        required
                    />
                </div>
                <div className="InputRow">
                    <label htmlFor="subject">الموضوع</label>
                    <input
                        type="text"
                        id="subject"
                        onChange={addForm}
                        placeholder="الموضوع *"
                        required
                    />
                </div>
                <div className="InputRow">
                    <label htmlFor="message">الرسالة</label>
                    <textarea
                        id="message"
                        onChange={addForm}
                        placeholder="نص الرسالة *"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="SubmitButton"
                    style={{ backgroundColor: buttonColor }}
                >
                    {buttonText}
                </button>
            </form>
        </>
    );
}

export default Form;