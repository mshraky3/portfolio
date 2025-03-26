import { useState } from 'react'
import "./Services.css"



function Services (){
    return( 
    <div className='servicesContenr' id='servicesContenr'>

        <h1 className='servicestitle'> Services</h1>
            <div className='cntent'>
                <div className='text'> 
                    <h1 className='title'>Services </h1>
                    <p>
                    Get a powerful website that delivers results with all-in-one solution 
                    </p>
                </div>
                <div className='Services'>
                    <div className='serves'>
                    <img width="70" height="70" src="https://img.icons8.com/cotton/100/web-design--v1.png" alt="web-design--v1"/>
                        <div className='nameD'> 
                            <h1 className='servicesName'> web design </h1>
                            <p className='detil'>Say goodbye to the hassle of managing multiple providers and get an all-in-one website solution that covers design, development, and content creation</p>
                        </div>
                    </div>
                    <div className='serves'>
                    <img width="70" height="70" src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/70/external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah.png" alt="external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah"/>                        <div className='nameD'> 
                            <h1 className='servicesName'> fornt-end development</h1>
                            <p className='detil'>Say goodbye to complex front-end challenges and get a seamless, user-friendly web experience built with modern technologies and best practices</p>
                        </div>
                    </div>
                    <div className='serves'>
                    <img width="70" height="70" src="https://img.icons8.com/ios/100/database--v1.png" alt="database--v1"/>                    <div className='nameD'> 
                            <h1 className='servicesName'> data base </h1>
                            <p className='detil'>Effortlessly manage data with robust databases, ensuring seamless integration, security, and scalability for your web applications</p>
                        </div>
                    </div>
                     </div>

            </div>
            </div>
    );
}






export default Services;