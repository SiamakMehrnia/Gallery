import cloudinary from "@/lib/cloudinary";
import { IncomingForm } from "formidable";
import dbConnect from "@/lib/mongodb";
import FeaturedArtist from "@/models/FeaturedArtist";

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

      const getSingleFile = (file) => {
        if (!file) return null;
        return Array.isArray(file) ? file[0] : file;
      };

      const getFilePath = (file) => {
        if (!file) return null;
        return file.filepath || file.path || null;
      };

      const getFieldValue = (field) => {
        if (!field) return "";
        return Array.isArray(field) ? field[0] : field;
      };

      const mainFile = getSingleFile(files.image);
      const file1 = getSingleFile(files.image1);
      const file2 = getSingleFile(files.image2);
      const file3 = getSingleFile(files.image3);
      const file4 = getSingleFile(files.image4);
      const file5 = getSingleFile(files.image5);

      const mainFilePath = getFilePath(mainFile);

      if (!mainFile || !mainFilePath) {
        return res.status(400).json({
          error: "Main image file is missing or invalid.",
          fileKeys: Object.keys(files || {}),
          imageMeta: mainFile
            ? {
                originalFilename: mainFile.originalFilename || null,
                mimetype: mainFile.mimetype || null,
                filepath: mainFile.filepath || null,
                path: mainFile.path || null,
              }
            : null,
        });
      }

      try {
        const uploadToCloudinary = async (file) => {
          if (!file) return null;

          const filePath = getFilePath(file);
          if (!filePath) return null;

          const uploaded = await cloudinary.uploader.upload(filePath, {
            folder: "Gallery",
            resource_type: "auto",
            format: "jpg",
          });

          return {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
          };
        };

        const mainImage = await uploadToCloudinary(mainFile);
        const img1 = await uploadToCloudinary(file1);
        const img2 = await uploadToCloudinary(file2);
        const img3 = await uploadToCloudinary(file3);
        const img4 = await uploadToCloudinary(file4);
        const img5 = await uploadToCloudinary(file5);

        if (!mainImage) {
          return res.status(400).json({ error: "Main image is required." });
        }

        const newItem = {
          title: getFieldValue(fields.title),
          artist: getFieldValue(fields.artist),
          year: parseInt(getFieldValue(fields.year), 10) || null,
          style: getFieldValue(fields.style),
          readTime: getFieldValue(fields.readTime),
          image: mainImage.url,
          public_id: mainImage.public_id,
          image1: img1?.url || "",
          image2: img2?.url || "",
          image3: img3?.url || "",
          image4: img4?.url || "",
          image5: img5?.url || "",
          desc1: getFieldValue(fields.desc1),
          desc2: getFieldValue(fields.desc2),
          desc3: getFieldValue(fields.desc3),
          desc4: getFieldValue(fields.desc4),
          desc5: getFieldValue(fields.desc5),
        };

        const result = await FeaturedArtist.create(newItem);
        return res.status(201).json({ message: "Artwork uploaded", data: result });
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to upload artwork", details: error.message });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
