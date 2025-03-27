import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

function Form() {
    // Initialize formData as an empty object
    const [formData, setFormData] = useState({});
    const [buttonText, setButtonText] = useState("Send Message");
    const [buttonColor, setButtonColor] = useState(""); // Track button color

    // Function to handle input changes and update formData
    function addForm(e) {
        const { id: name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    // Function to handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Reset button text and color before sending the request
            setButtonText("Sending...");
            setButtonColor("");

            // Send POST request to the backend
            const response = await axios.post('https://portfolio-api-rose.vercel.app/send-email', formData);

            // Check if the response status is 200 (success)
            if (response.status === 200) {
                setButtonText("Message Sent!");
                setButtonColor("green"); // Change button color to green
            }
        } catch (error) {
            // Handle errors (e.g., network issues, server errors)
            console.error("Error sending email:", error);
            setButtonText("Failed to Send");
            setButtonColor("red"); // Change button color to red
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
                    style={{ backgroundColor: buttonColor }} // Dynamically set button color
                >
                    {buttonText}
                </button>
            </form>
        </>
    );
}

export default Form;