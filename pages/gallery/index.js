import { useEffect, useState } from "react";
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
      <h1 className="text-3xl font-bold mb-8 text-center ">Featured Artists</h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <ArtistCard key={artist._id} artist={artist} />
        ))}
      </div>
    </div>
  );
}