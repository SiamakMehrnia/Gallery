import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ArtistCard from "@/components/galleryComponents/ArtistCard";

export default function GalleryIndex() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setArtists(data));
  }, []);

  return (
    <div className="min-h-screen p-10 font-serif mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl mb-8 text-center"
      >
        Featured Artists
      </motion.h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <ArtistCard key={artist._id} artist={artist} />
        ))}
      </div>
    </div>
  );
}