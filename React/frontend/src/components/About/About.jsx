import React , {useState} from "react";
import "./About.css";
import img from "./me.png";

function About() {
    const [state , set_state] = useState(true)
    return (
        <div className="aboutSection" id="aboutSection">
            <div className="aboutImageSection">
                <div className="aboutCurcle">
                    <img src={img} alt="Profile" />
                </div>
            </div>
            <div className="aboutText">
                <div className="aboutTextTitle"><h4>About - Mhumod Alshraky</h4></div>
                <div className="aboutTextBody"><p>Get a website that will make a lasting impression on your audience!!</p></div>
                <div className="aboutTextDeilt"><p>My name is Mhumod Alshraky, and I am a web developer specializing in designing and building web applications. I have hands-on experience with modern technologies such as React, Express, and PostgreSQL, which allows me to create dynamic, efficient, and scalable solutions tailored to meet your needs.</p></div>
                <div className="aboutTexticons">
                    <a href="https://www.instagram.com/m_alshraky/" target="_blank" rel="noopener noreferrer">
                        <img width="40" height="40" src="https://img.icons8.com/material-two-tone/100/instagram-new.png" alt="instagram" />
                    </a>
                    <a href="https://github.com/mshraky3" target="_blank" rel="noopener noreferrer">
                        <img width="40" height="40" src="https://img.icons8.com/fluency/40/github.png" alt="github" />
                    </a>
                    <a href="https://wa.link/5zcep6" target="_blank" rel="noopener noreferrer">
                        <img width="40" height="40" src="https://img.icons8.com/ios-glyphs/40/whatsapp.png" alt="whatsapp" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default About;