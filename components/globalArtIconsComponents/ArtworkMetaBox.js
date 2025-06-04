import { FaUser, FaClock, FaPaintBrush, FaCalendar } from 'react-icons/fa';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function ArtworkMetaBox({ artist, year, style, readTime, image, title, thumbnail }) {
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
      className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-gray-300 font-serif h-fit space-y-4"
    >
      <h2 className="text-xl  text-black mb-2">Artwork Information</h2>
      <img
        src={thumbnail || image}
        alt={`${title} thumbnail`}
        className="w-full h-auto rounded shadow mb-4 border-1 border-gray-300 object-cover"
      />
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FaUser className="text-black" />
          <span><strong>Artist:</strong> {artist}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendar className="text-black" />
          <span><strong>Year:</strong> {year}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPaintBrush className="text-black" />
          <span><strong>Style:</strong> {style}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-black" />
          <span><strong>Read Time:</strong> {readTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
