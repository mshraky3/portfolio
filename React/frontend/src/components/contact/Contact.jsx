import React  , {useState} from "react";
import "./Contact.css";
import Form from "./Form";




function Contact() {
    const date = new Date().getFullYear();
    return (
        <>
            <div className="ContactMe">
                <div className="ContactDetai">
                    <div className="ContactForm">
                        <div className="ContactFormHeader">
                            <div className="ContactFormTitle">GET IN TOUCH</div>
                            <div className="ContactFormSubtitle">Let's Discuss Projects</div>
                        </div>
                        <div className="ContactFormText">
                            Get in touch with us for any kind of help. We are here to give you the best and also here to help you to find your projects.
                        </div>
                        <Form/>
                    </div>
                    <div className="ContactInfo">
                        <div className="ContactInfoItem">
                            <div className="ContactIcon"><img width="40" height="40" src="https://img.icons8.com/ios/40/phone--v1.png" alt="phone--v1"/></div>
                            <div className="ContactInfoText">
                                <strong>Phone</strong>
                                <p>+966 582 619 119</p>
                            </div>
                        </div>
                        <div className="ContactInfoItem">
                            <div className="ContactIcon"><img width="30" height="30" src="https://img.icons8.com/ios/40/new-post--v1.png" alt="new-post--v1"/></div>
                            <div className="ContactInfoText">
                                <strong>Mail</strong>
                                <p>muhmodalshraky3"gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Footer">
                    <hr className="br"/>
                    © {date} copyright all rights reserved
                </div>
            </div>
        </>
    );
}

export default Contact;