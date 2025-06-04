import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/router';

import ArtworkCard from '@/components/globalArtIconsComponents/ArtworkCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const GlobalArtIconsPage = () => {
  const router = useRouter();

  const [globalArtIcons, setGlobalArtIcons] = useState([]);

  useEffect(() => {
    const fetchGlobalArtIcons = async () => {
      try {
        const response = await fetch('/api/global');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        setGlobalArtIcons(data);
      } catch (error) {
        console.error('Error fetching global art icons:', error);
      }
    };

    fetchGlobalArtIcons();
  }, []);

  const handleViewDetails = (art) => {
    router.push({
      pathname: `/GlobalArtIcons/${art._id}`,
    });
  };

  return (
    <ScrollArea className="min-h-screen py-10 px-4 bg-white text-black font-serif">
      <div className="max-w-5xl mx-auto font-serif mt-20">
        <Card className="mb-8  text-center shadow-md rounded-full font-serif">
          <CardHeader>
            <CardTitle className="text-3xl tracking-wide text-black font-serif">Global Art Icons</CardTitle>
          </CardHeader>
        </Card>
        <Separator className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {globalArtIcons.length > 0 && globalArtIcons.map((art) => (
            <ArtworkCard
              key={art._id}
              art={art}
              onClick={() => handleViewDetails(art)}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default GlobalArtIconsPage;