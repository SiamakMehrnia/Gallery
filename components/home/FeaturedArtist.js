import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function FeaturedArtist() {
  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();
  const [refLeft, inViewLeft] = useInView({ triggerOnce: false });
  const [refRight, inViewRight] = useInView({ triggerOnce: false });

  useEffect(() => {
    controlsLeft.start(inViewLeft ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 });
    controlsRight.start(inViewRight ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 });
  }, [controlsLeft, inViewLeft, controlsRight, inViewRight]);

  return (
    <section className="max-w-6xl mx-auto bg-white text-black py-10 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div
          ref={refLeft}
          initial={{ opacity: 0, x: -100 }}
          animate={controlsLeft}
          transition={{ type: "spring", stiffness: 80, damping: 15, mass: 0.5 }}
          className="w-full md:w-1/2"
        >
          <img
            src="https://res.cloudinary.com/dr5h0ms9o/image/upload/v1776956442/k7ultpkzvm7b1py9ho7x.png"
            alt="Featured Artist"
            className="w-full h-auto object-cover rounded-xl "
          />
        </motion.div>
        <motion.div
          ref={refRight}
          initial={{ opacity: 0, x: 100 }}
          animate={controlsRight}
          transition={{ type: "spring", stiffness: 80, damping: 15, mass: 0.5 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h2 className="text-3xl  mb-4">Featured Artist</h2>
          <p className="text-gray-700 leading-relaxed">
            Meet <strong>Afsaneh Eftekhari</strong>, A passionate artist with more than 15 years of experience, bringing emotion and personality into every piece she creates.
          </p>
        </motion.div>
      </div>
    </section>
  );
}