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
     With nearly 15 years of experience in painting, she has dedicated her artistic journey to creating works that reflect emotion, elegance, and individuality. Her passion for art is rooted in a deep appreciation for beauty, detail, and personal expression, allowing each piece to carry its own unique story.

Over the years, she has developed a distinctive style shaped by experience, creativity, and a strong connection to her craft. Her work is not only a reflection of technical skill, but also of a genuine love for painting and the meaningful atmosphere that art can bring into a space.

Through every artwork, she aims to inspire, connect, and leave a lasting impression, offering pieces that are both visually captivating and personally resonant. and bring meaningful art experiences to a global audience through a seamless digital platform. Join us in celebrating artistic vision and storytelling across borders and generations.
      </p>
    </motion.section>
  );
}