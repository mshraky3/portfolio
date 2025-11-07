import "./Services.css";
import Button from '@mui/material/Button';
import { motion } from "framer-motion";

function Services() {
  return (
    <motion.div 
      className='servicesContenr' 
      id='SERVICES'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h1 
        className='servicestitle'
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Services
      </motion.h1>
      <div className='cntent'>
        <motion.div 
          className='text'
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h1 className='title'></h1>
          <p>Get a powerful website that delivers results with an all-in-one solution</p>
        </motion.div>
        <div className='Services'>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/cotton/100/web-design--v1.png" 
              alt="Web Design Icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <div className='nameD'>
              <h1 className='servicesName'>Web Design</h1>
              <p className='detil'>Say goodbye to the hassle of managing multiple providers and get an all-in-one website solution that covers design, development, and content creation.</p>
            </div>
          </motion.div>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/70/external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah.png" 
              alt="Front-End Development Icon"
              whileHover={{ rotate: -360 }}
              transition={{ duration: 0.6 }}
            />
            <div className='nameD'>
              <h1 className='servicesName'>Front-End Development</h1>
              <p className='detil'>Say goodbye to complex front-end challenges and get a seamless, user-friendly web experience built with modern technologies and best practices.</p>
            </div>
          </motion.div>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/ios/100/database--v1.png" 
              alt="Database Icon"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
            />
            <div className='nameD'>
              <h1 className='servicesName'>Database</h1>
              <p className='detil'>Effortlessly manage data with robust databases, ensuring seamless integration, security, and scalability for your web applications.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Services;