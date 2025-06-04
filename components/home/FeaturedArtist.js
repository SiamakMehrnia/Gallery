import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function FeaturedArtist() {
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
      className="max-w-3xl mx-auto bg-white rounded-xl shadow overflow-hidden text-center border border-gray-300 text-black"
    >
      <img
        src="https://source.unsplash.com/800x400/?artist,portrait"
        alt="Featured Artist"
        className="w-64 h-64 object-cover rounded-full mx-auto mt-6 shadow-md  border border-gray-300"
      />
      <div className="p-6">
        <h2 className="text-2xl  mb-2">Featured Artist</h2>
        <p className="text-gray-700 leading-relaxed">
          Meet <strong>Alexandra Monroe</strong>, a contemporary painter known for her emotionally resonant abstract works...
        </p>
      </div>
    </motion.section>
  );
}