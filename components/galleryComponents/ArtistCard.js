import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import Link from "next/link";

const formatToJpg = (url) => url?.replace("/upload/", "/upload/f_jpg/");

export default function ArtistCard({ artist }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (inView) {
      setHasBeenInView(true);
    }
    if (hasBeenInView) {
      controls.start(inView ? { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } : { opacity: 0, y: 40, transition: { duration: 0.5, ease: "easeIn" } });
    }
  }, [controls, inView, hasBeenInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      className="bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden flex flex-col font-serif"
    >
      <img
        src={formatToJpg(artist.image)}
        alt={artist.artist}
        className="w-full h-auto max-h-[400px] object-contain rounded-t-xl"
      />
      <h2 className="text-2xl md:text-3xl font-serif font-bold mt-4 px-4 text-black text-center">{artist.title}</h2>
      <p className="text-sm text-gray-500 mb-4 px-4 italic text-center font-serif">{artist.style}</p>
      <div className="px-4 pb-4 mt-auto">
        <Link href={`/gallery/${artist._id}`}>
          <button className="w-full px-4 py-2 text-black border-1  rounded hover:bg-gray-300 transition duration-200 font-serif">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
}