import cloudinary from "@/lib/cloudinary";

import formidable from "formidable";

import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/FeaturedArtist";
import mongoose from "mongoose";
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    switch (req.method) {
      case "GET":
        const item = await Gallery.findById(id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.status(200).json(item);
        break;

      case "PUT":
        const form = new formidable.IncomingForm({ keepExtensions: true });
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(500).json({ error: "Form parsing error" });
          }

          const existingItem = await Gallery.findById(id);
          if (!existingItem) {
            return res.status(404).json({ error: "Item not found" });
          }

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

          const fileFields = ["image", "image1", "image2", "image3", "image4", "image5"];
          const updatedData = { ...fields };

          for (const key of fileFields) {
            if (files[key]) {
              const uploaded = await uploadToCloudinary(files[key]);
              if (uploaded) {
                const oldPublicId = existingItem[`${key}PublicId`] || existingItem.public_id;
                if (oldPublicId) {
                  try {
                    await cloudinary.uploader.destroy(oldPublicId);
                  } catch (err) {
                    console.warn(`Failed to delete old image: ${oldPublicId}`);
                  }
                }
                updatedData[key] = uploaded.url;
                updatedData[`${key}PublicId`] = uploaded.public_id;
              }
            }
          }

          const updatedItem = await Gallery.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
          });

          return res.status(200).json(updatedItem);
        });
        break;

      case "DELETE":
        const itemToDelete = await Gallery.findById(id);
        if (!itemToDelete)
          return res.status(404).json({ error: "Item not found" });

        const publicIds = [
          itemToDelete.public_id,
          itemToDelete.image1PublicId,
          itemToDelete.image2PublicId,
          itemToDelete.image3PublicId,
          itemToDelete.image4PublicId,
          itemToDelete.image5PublicId,
        ].filter(Boolean);

        for (const pid of publicIds) {
          try {
            await cloudinary.uploader.destroy(pid);
          } catch (err) {
            console.warn(`Failed to delete image with public_id: ${pid}`);
          }
        }

        await Gallery.findByIdAndDelete(id);
        res
          .status(200)
          .json({ message: "Item and all associated images deleted" });
        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
