import cloudinary from "@/lib/cloudinary";
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import dbConnect from "@/lib/mongodb";
import FeaturedArtist from "@/models/FeaturedArtist";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const data = await FeaturedArtist.find();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    }
  } else if (req.method === "POST") {
    const form = new IncomingForm({
      multiples: true,
      uploadDir: "/tmp",
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error parsing form data", details: err.message });
      }

     

      if (!files.image || !files.image.filepath) {
        return res.status(400).json({ error: "Main image file is missing or invalid." });
      }

      try {
        const uploadToCloudinary = async (file) => {
          if (!file || !file.filepath) return null;
          const uploaded = await cloudinary.uploader.upload(file.filepath, {
            folder: "Gallery",
          });
          return {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
          };
        };

        const mainImage = await uploadToCloudinary(files.image);
        const img1 = await uploadToCloudinary(files.image1);
        const img2 = await uploadToCloudinary(files.image2);
        const img3 = await uploadToCloudinary(files.image3);
        const img4 = await uploadToCloudinary(files.image4);
        const img5 = await uploadToCloudinary(files.image5);

        if (!mainImage) {
          return res.status(400).json({ error: "Main image is required." });
        }

        const newItem = {
          title: fields.title ? (Array.isArray(fields.title) ? fields.title[0] : fields.title) : "",
          artist: fields.artist ? (Array.isArray(fields.artist) ? fields.artist[0] : fields.artist) : "",
          year: fields.year ? parseInt(Array.isArray(fields.year) ? fields.year[0] : fields.year) || null : null,
          style: fields.style ? (Array.isArray(fields.style) ? fields.style[0] : fields.style) : "",
          readTime: fields.readTime ? (Array.isArray(fields.readTime) ? fields.readTime[0] : fields.readTime) : "",
          image: mainImage.url,
          public_id: mainImage.public_id,
          image1: img1?.url || "",
          image2: img2?.url || "",
          image3: img3?.url || "",
          image4: img4?.url || "",
          image5: img5?.url || "",
          desc1: fields.desc1 ? (Array.isArray(fields.desc1) ? fields.desc1[0] : fields.desc1) : "",
          desc2: fields.desc2 ? (Array.isArray(fields.desc2) ? fields.desc2[0] : fields.desc2) : "",
          desc3: fields.desc3 ? (Array.isArray(fields.desc3) ? fields.desc3[0] : fields.desc3) : "",
          desc4: fields.desc4 ? (Array.isArray(fields.desc4) ? fields.desc4[0] : fields.desc4) : "",
          desc5: fields.desc5 ? (Array.isArray(fields.desc5) ? fields.desc5[0] : fields.desc5) : "",
        };

        const result = await FeaturedArtist.create(newItem);
        res.status(201).json({ message: "Artwork uploaded", data: newItem });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to upload artwork", details: error.message });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
