import React from "react";
import { motion } from "framer-motion";

const LoginLeftGrid = () => {
  return (
    <div className="lg:w-1/2 md:w-1/2 flex bg-[#F97316] flex-col justify-center items-center p-8">
      <motion.h1 initial={{opacity: 0, y: -100}} animate={{opacity: 1, y: 0, rotate: 360}} transition={{delay: 0.6, duration: 0.4}} className="text-white text-3xl md:text-5xl font-bold mb-4">
        BAND TEST
      </motion.h1>
      <p className="text-white text-sm md:text-lg mb-6">Check the Status</p>
      <p className="text-white text-center text-sm md:text-lg mb-6">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout.
      </p>
      <div className="flex space-x-4 mb-6">
        <motion.a initial={{opacity: 0, x: -30}} animate={{opacity: 1, x: 0}} transition={{delay: 0.4, duration: 0.6, ease: "easeOut"}} href="https://github.com/ShittuIbrahim00" className="text-white md:text-2xl underline">
          Github
        </motion.a>
        <motion.a initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4, duration: 0.6, ease: "easeOut"}} href="https://vercel.com/shittus-projects" className="text-white md:text-2xl underline">
          Vercel
        </motion.a>
        <motion.a initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} transition={{delay: 0.4, duration: 0.6, ease: "easeOut"}} href="https://www.linkedin.com/in/ibrahim-shittu-78b55b355" className="text-white md:text-2xl underline">
          LinkedIn
        </motion.a>
      </div>
      <p className="text-white text-sm text-center">
        Privacy Policy | Contact © 2025 ShittuZone
      </p>
    </div>
  );
};

export default LoginLeftGrid;
