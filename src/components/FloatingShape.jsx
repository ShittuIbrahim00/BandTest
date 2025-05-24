import { motion } from "framer-motion";

const Floatingshape = ({ size, top, left, color, delay, bottom, right }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-40 blur-md`}
      style={{ top, left, bottom, right }}
      animate={{
        y: ["0%", "100%", "0"],
        x: ["0%", "100%", "0"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default Floatingshape;
