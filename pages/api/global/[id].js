import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};


import dbConnect from "@/lib/mongodb";
import GlobalArt from "@/models/GlobalArt";
import cloudinary from "@/lib/cloudinary";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const art = await GlobalArt.findById(id);
        if (!art) {
          return res.status(404).json({ success: false, message: "Not found" });
        }
        res.status(200).json(art);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(400).json({ success: false, error: err.message });
          }

          const existingArt = await GlobalArt.findById(id);
          if (!existingArt) {
            return res.status(404).json({ success: false, message: "Not found" });
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

          // Upload new image if provided and delete old
          if (files.image) {
            if (existingArt.image) {
              const publicId = existingArt.image.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(`Gallery/${publicId}`);
            }
            const uploadedImage = await uploadToCloudinary(files.image);
            if (uploadedImage) existingArt.image = uploadedImage.url;
          }

          // Upload new thumbnail if provided and delete old
          if (files.thumbnail) {
            if (existingArt.thumbnail) {
              const thumbId = existingArt.thumbnail.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(`Gallery/${thumbId}`);
            }
            const uploadedThumb = await uploadToCloudinary(files.thumbnail);
            if (uploadedThumb) existingArt.thumbnail = uploadedThumb.url;
          }

          // Update other fields
          Object.keys(fields).forEach((key) => {
            if (key in existingArt) {
              existingArt[key] = fields[key];
            }
          });

          await existingArt.save();
          res.status(200).json(existingArt);
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const artToDelete = await GlobalArt.findById(id);
        if (!artToDelete) {
          return res.status(404).json({ success: false, message: "Not found" });
        }

        const publicId = artToDelete.image.split("/").pop().split(".")[0];
        const thumbId = artToDelete.thumbnail.split("/").pop().split(".")[0];

        console.log("Deleting artwork with ID:", id);
        console.log("Image Public ID:", publicId);
        console.log("Thumbnail Public ID:", thumbId);

        await cloudinary.uploader.destroy(`Gallery/${publicId}`);
        await cloudinary.uploader.destroy(`Gallery/${thumbId}`);

        await GlobalArt.findByIdAndDelete(id);

        console.log("Artwork deleted successfully from Cloudinary and database");

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}