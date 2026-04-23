import dbConnect from "@/lib/mongodb";
import FeaturedArtist from "@/models/FeaturedArtist";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const data = await FeaturedArtist.find();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        title,
        artist,
        year,
        style,
        readTime,
        descMain,
        desc1,
        desc2,
        desc3,
        desc4,
        desc5,
        image,
        public_id,
        image1,
        image2,
        image3,
        image4,
        image5,
      } = req.body;

      if (!image) {
        return res.status(400).json({ error: "Main image is required." });
      }

      const newItem = {
        title: title || "",
        artist: artist || "",
        year: parseInt(year, 10) || null,
        style: style || "",
        readTime: readTime || "",
        descMain: descMain || "",
        desc1: desc1 || "",
        desc2: desc2 || "",
        desc3: desc3 || "",
        desc4: desc4 || "",
        desc5: desc5 || "",
        image: image || "",
        public_id: public_id || "",
        image1: image1 || "",
        image2: image2 || "",
        image3: image3 || "",
        image4: image4 || "",
        image5: image5 || "",
      };

      const result = await FeaturedArtist.create(newItem);
      return res.status(201).json({ message: "Artwork uploaded", data: result });
    } catch (error) {
      return res.status(500).json({ error: "Failed to save artwork", details: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
