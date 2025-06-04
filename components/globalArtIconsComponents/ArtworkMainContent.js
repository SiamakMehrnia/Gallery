import React, { useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function ArtworkMainContent({ image, title, description }) {
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
      className="md:col-span-2 flex flex-col"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-[400px] object-cover  shadow mb-6 rounded-2xl border-2 border-gray-300"
      />
      <div className="text-gray-800 text-justify whitespace-pre-line text-lg leading-relaxed bg-white rounded-xl p-4 shadow">
        {description}
      </div>
    </motion.div>
  );
}
