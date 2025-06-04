import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { image } = req.body;

    try {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: "gallery-art",
      });

      res.status(200).json({ url: uploadedResponse.secure_url });
    } catch (err) {
      res.status(500).json({ error: "Upload failed", details: err });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}