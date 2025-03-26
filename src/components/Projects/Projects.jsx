import React from "react";
import "./projects.css"
import Button from '@mui/material/Button';


function Projects() {
     return (
          <>
               <div className="projects">
                    <div className="projectsTitle">
                         <h1>
                              some of my Projects
                         </h1>
                    </div>
                    <div className="project">
                         <div className="projectCard">
                              <h1 className="projectCardTitle">
                                   project 1
                              </h1>
                              <div className="projectCardText">
                                   Keeper-App is a React front-end note organizer with Express API and PostgreSQL storage, designed for simplicity and efficiency.                    </div>
                              <div className="projectCardButton">
                              <a href="https://keeper-front-407pqrtkb-mshraky3s-projects.vercel.app/">
                                   <Button>view </Button>
                              </a>
                              </div>
                         </div>
                         <div className="projectType">
                              <Button >React</Button>
                              <Button>Postgres</Button>

                         </div>
                    </div>
                    <div className="project">
                         <div className="projectCard">
                              <h1 className="projectCardTitle">
                                   project 2
                              </h1>
                              <div className="projectCardText">
                                   Keeper-App is a React front-end note organizer with Express API and PostgreSQL storage, designed for simplicity and efficiency.                    </div>
                              <div className="projectCardButton">
                                   <Button>view </Button>

                              </div>
                         </div>
                         <div className="projectType">
                              <Button >React</Button>
                              <Button>Postgres</Button>

                         </div>
                    </div>
                    <div className="project">
                         <div className="projectCard">
                              <h1 className="projectCardTitle">
                                   project 3
                              </h1>
                              <div className="projectCardText">
                                   Keeper-App is a React front-end note organizer with Express API and PostgreSQL storage, designed for simplicity and efficiency.                    </div>
                              <div className="projectCardButton">
                                   
                                        <Button>view</Button>
                         

                              </div>
                         </div>
                         <div className="projectType">
                              <Button >React</Button>
                              <Button>Postgres</Button>

                         </div>
                    </div>
               </div>
          </>
     );
}



export default Projects;