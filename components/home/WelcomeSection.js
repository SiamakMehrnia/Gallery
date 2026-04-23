import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
export default function WelcomeSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    controls.start(inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 });
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center   text-black"
    >
      <h1 className="text-4xl  tracking-tight">Welcome to the Gallery Afsaneh</h1>
      <p className="mt-2 text-lg">Where art meets inspiration</p>
    </motion.div>
  );
}