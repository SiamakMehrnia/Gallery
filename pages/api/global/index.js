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

      const getValue = (field) =>
        Array.isArray(field) ? field[0] : field;

      const rawYear = getValue(fields.year);
      const parsedYear =
        rawYear && rawYear.toString().trim() !== ""
          ? parseInt(rawYear.toString().trim(), 10)
          : null;

      if (rawYear && rawYear.toString().trim() !== "" && Number.isNaN(parsedYear)) {
        return res.status(400).json({ error: "Year must be a valid number" });
      }

      const newArtwork = new GlobalArt({
        title: getValue(fields.title),
        artist: getValue(fields.artist),
        year: parsedYear,
        style: getValue(fields.style),
        image: imageData?.url || "",
        thumbnail: thumbnailData?.url || "",
        description: getValue(fields.description),
        readTime: getValue(fields.readTime),
      });

      await newArtwork.save();
      return res.status(201).json(newArtwork);
    } catch (error) {
      console.error("Error in POST /api/global:", error);
      return res.status(500).json({ error: "Failed to create artwork" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
