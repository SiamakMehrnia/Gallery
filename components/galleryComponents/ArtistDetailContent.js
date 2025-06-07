import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const formatToJpg = (url) => url?.replace("/upload/", "/upload/f_jpg/");

export default function ArtistDetailContent({ artist }) {
  const featuredImageRef = useRef(null);

  const [featuredImage, setFeaturedImage] = useState({
    src: formatToJpg(artist.image1),
    desc: artist.desc1,
  });

  if (!artist) {
    return <div className="p-10 text-center text-lg">Loading artist details...</div>;
  }

  return (
    <>
      <div className="relative min-h-[calc(100vh-64px)] pt-24 px-4 sm:px-6 lg:px-8 bg-white text-gray-900 mt-16">
        <div className="max-w-5xl mx-auto mb-6">
          <Link href="/gallery">
            <button className="px-4 py-2   rounded hover:bg-neutral-400 transition">
              Back to Gallery
            </button>
          </Link>
        </div>
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-3xl   space-y-8">
          {/* <img
            src={artist.image}
            alt={artist.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl border-4 border-gray-600 shadow-xl"
          /> */}
          <h1 className="text-4xl md:text-5xl font-serif  mb-2 text-center ">{artist.title}</h1>
          <p className="text-gray-800 text-center leading-relaxed font-light text-base md:text-lg italic font-serif">{artist.description}</p>
          
          <AnimatePresence mode="wait">
            {featuredImage?.src && (
              <motion.div
                key={featuredImage.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
                ref={featuredImageRef}
              >
                <img
                  src={featuredImage.src}
                  alt="Main Artwork"
                  className="w-full max-h-[600px] object-cover rounded-xl shadow-xl "
                />
                <p className="mt-2 text-gray-700 italic text-center">{featuredImage.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5].map((n) => {
              if (!artist[`image${n}`]) return null;

              const controls = useAnimation();
              const [ref, inView] = useInView({ triggerOnce: false });

              useEffect(() => {
                controls.start(inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 });
              }, [controls, inView]);

              return (
                <div key={n} ref={ref}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={controls}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className=" rounded overflow-hidden  cursor-pointer"
                    onClick={() => {
                      setFeaturedImage({
                        src: formatToJpg(artist[`image${n}`]),
                        desc: artist[`desc${n}`],
                      });
                      featuredImageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    <img
                      src={formatToJpg(artist[`image${n}`])}
                      alt={`Artwork ${n}`}
                      className="w-full h-40 object-cover"
                    />
                    {/* <p className="p-2 text-sm text-gray-600 italic">{artist[`desc${n}`]}</p> */}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}