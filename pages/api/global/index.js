import { IncomingForm } from "formidable";
import cloudinary from "@/lib/cloudinary";
import fs from "fs";
import os from "os";
import path from "path";
import dbConnect from "@/lib/mongodb";
import GlobalArt from "@/models/GlobalArt";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const artworks = await GlobalArt.find({});
      return res.status(200).json(artworks);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch artworks" });
    }
  }

  if (req.method === "POST") {
    const form = new IncomingForm();
    form.uploadDir = path.join(os.tmpdir());
    form.keepExtensions = true;

    const parseForm = () =>
      new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    try {
      const { fields, files } = await parseForm();

      const uploadToCloudinary = async (file) => {
        if (!file || !file.filepath) return null;
        const uploaded = await cloudinary.uploader.upload(file.filepath, {
          folder: "Gallery",
        });
        fs.unlinkSync(file.filepath);
        return {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        };
      };

      const imageData = files.image ? await uploadToCloudinary(files.image) : null;
      const thumbnailData = files.thumbnail ? await uploadToCloudinary(files.thumbnail) : null;

      const newArtwork = new GlobalArt({
        title: fields.title,
        artist: fields.artist,
        year: fields.year ? parseInt(fields.year, 10) : null,
        style: fields.style,
        image: imageData?.url || "",
        thumbnail: thumbnailData?.url || "",
        description: fields.description,
        readTime: fields.readTime,
      });

      await newArtwork.save();
      return res.status(201).json(newArtwork);
    } catch (error) {
      console.error("Error in POST /api/global:", error);
      return res.status(500).json({ error: "Failed to create artwork" });
    }
    return;
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
