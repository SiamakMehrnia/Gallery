import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function AboutUs() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    controls.start(inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 });
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-3xl mx-auto bg-white p-6 font-serif text-center"
    >
      <h2 className="text-2xl text-black mb-4">About Us</h2>
      <p className="text-gray-700 leading-relaxed">
        Welcome to our online art gallery — a curated space where creativity, culture, and expression converge. We proudly showcase a diverse collection of contemporary and classical works from both emerging and established artists. Our mission is to inspire, connect, and bring meaningful art experiences to a global audience through a seamless digital platform. Join us in celebrating artistic vision and storytelling across borders and generations.
      </p>
    </motion.section>
  );
}