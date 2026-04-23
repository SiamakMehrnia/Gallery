import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function ContactUs() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    controls.start(inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 });
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-3xl mx-auto bg-white p-6 font-serif text-center"
    >
      <h2 className="text-2xl font-serif text-black mb-4">Contact Us</h2>
      <p className="text-gray-700 leading-relaxed">
        Have questions, feedback, or looking to start a creative collaboration with us? We're always open to new ideas and partnerships. Please don't hesitate to get in touch. 
        You can reach us by email at 
        <a href="mailto:info@artgallery.com" className="text-blue-600 underline">Eftekhari.afsa@gmail.com</a>. 
        We look forward to hearing from you and exploring the possibilities together.
      </p>
    </motion.section>
  );
}