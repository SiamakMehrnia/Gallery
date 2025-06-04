import { useRouter } from 'next/router';
import { FaUser, FaClock, FaPaintBrush, FaCalendar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import ArtworkMainContent from '@/components/globalArtIconsComponents/ArtworkMainContent';
import ArtworkMetaBox from '@/components/globalArtIconsComponents/ArtworkMetaBox';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArtworkDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [art, setArt] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchArt = async () => {
      try {
        const response = await fetch(`/api/global/${id}`);
        if (!response.ok) throw new Error("Failed to fetch artwork");
        const data = await response.json();
        setArt(data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };

    fetchArt();
  }, [router.isReady, id]);

  if (!art) {
    return <div className="p-6 text-center">Artwork not found.</div>;
  }

  const {
    title,
    artist,
    year,
    style,
    image,
    thumbnail,
    description,
    readTime,
  } = art;

  return (
    <>
      <div className="min-h-screen px-4 py-10 bg- text-black mt-20">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6 bg- text-center shadow-md rounded-full">
            <CardHeader>
              <CardTitle className="text-3xl tracking-wide text-black ">{title}</CardTitle>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-3 gap-6">
            <ArtworkMainContent image={image} title={title} description={description} />
            <ArtworkMetaBox
              artist={artist}
              year={year}
              style={style}
              readTime={readTime}
              image={image}
              title={title}
              thumbnail={thumbnail}
            />
          </div>
        </div>
      </div>
    </>
  );
}