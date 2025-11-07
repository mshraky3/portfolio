import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

function Form() {
    const [formData, setFormData] = useState({});
    const [buttonText, setButtonText] = useState("Send Message");
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
            setButtonText("Sending...");
            setButtonColor("");

            const response = await axios.post('https://portfolio-api-rose.vercel.app/send-email', formData);

            if (response.status === 200) {
                setButtonText("Message Sent!");
                setButtonColor("green");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setButtonText("Failed to Send");
            setButtonColor("red");
        }
    }

    return (
        <>
            <form className="ContactFormInputs" onSubmit={handleSubmit}>
                <div className="InputRow">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        onChange={addForm}
                        placeholder="Name *"
                        required
                    />
                </div>
                <div className="InputRow">
                    <label htmlFor="email">Your Email</label>
                    <input
                        type="email"
                        id="email"
                        onChange={addForm}
                        placeholder="Email *"
                        required
                    />
                </div>
                <div className="InputRow">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        onChange={addForm}
                        placeholder="Subject *"
                        required
                    />
                </div>
                <div className="InputRow">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                        id="message"
                        onChange={addForm}
                        placeholder="Your message *"
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