import React, { useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const formatToJpg = (url) => url?.replace("/upload/", "/upload/f_jpg/");

export default function ArtworkCard({ art, onClick }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    controls.start(inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 });
  }, [controls, inView]);

  return (
    <div onClick={onClick} className="cursor-pointer">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl overflow-hidden   hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
      >
        <img
          src={formatToJpg(art.image)}
          alt={art.title}
          className="w-full h-64 object-cover   rounded-t-3xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <div className="p-5 font-serif">
          <h2 className="text-2xl font-serif tracking-wide font-bold text-balck">{art.title}</h2>
          <p className="text-sm text-black italic mb-2">
            {art.artist} • {art.year} • {art.style}
          </p>
          <p className="text-sm text-black line-clamp-3 mb-4 leading-relaxed">
            {art.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}