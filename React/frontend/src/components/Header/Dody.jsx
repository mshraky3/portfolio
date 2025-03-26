import React, { useState, useEffect, useRef } from "react";
import "./HeaderStyle/Body.css";
import Button from '@mui/material/Button';
import logo from "./images/test-me.png";
import IAM from "./iam";
import Stats from "./Stats";


function Body() {
  return (
    <div className="contener">
      <div className="black">
        <div className="black-content">
          <div className="name">
            <h1>I'm mahmoud</h1>
          </div>
          <IAM/>
          <div className="btn"> <a href="https://wa.link/5zcep6">
            <Button>
             
              GIT IN TOUCH
              <img
                src="https://img.icons8.com/?size=100&id=biaPj0fC1TKb&format=png&color=ffffff"
                alt="arrow"
                style={{ marginLeft: '10px' }}
              />
              
            </Button></a>
          </div>
        <Stats/>
        </div>
      </div>
      <div className="image">
        <img src={logo} alt="Profile Image" style={{ width: '130%', height: 'auto' }} />
      </div>
      <div className="purple">
            <div className="icons">
              <div className="icon r"><img width="60" height="60" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" alt="external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo"/></div>
              <div className="icon"><img width="60" height="60" src="https://img.icons8.com/color-glass/96/bootstrap.png" alt="bootstrap"/></div>
              <div className="icon"><img width="60" height="60" src="https://img.icons8.com/fluency/96/node-js.png" alt="node-js"/></div>
              <div className="icon"><img width="60" height="60" src="https://img.icons8.com/color/96/postgreesql.png" alt="postgreesql"/></div>
              <div className="icon"><img width="60" height="100" src="https://img.icons8.com/pastel-glyph/100/FFFFFF/down.png" alt="down"/></div>
              <div className="icon"> <p>specialties</p> </div>
            </div>
      </div>
    </div>
  );
}

export default Body;