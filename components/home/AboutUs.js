import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function AboutUs() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    controls.start(inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 });
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow border border-gray-300 font-serif"
    >
      <h2 className="text-2xl text-black mb-4">About Us</h2>
      <p className="text-gray-700 leading-relaxed">
        We are an online art gallery dedicated to showcasing beautiful artwork...
      </p>
    </motion.section>
  );
}