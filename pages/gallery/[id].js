import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArtistDetailContent from "@/components/galleryComponents/ArtistDetailContent";

export default function ArtistDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [artist, setArtist] = useState(null);

useEffect(() => {
  if (router.isReady && id) {
    fetch(`/api/gallery/${id}`)
      .then((res) => res.json())
      .then(setArtist)
      .catch(console.error);
  }
}, [router.isReady, id]);

  if (!artist) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  console.log("ARTIST DATA:", artist);
  return <ArtistDetailContent artist={artist} />;
}