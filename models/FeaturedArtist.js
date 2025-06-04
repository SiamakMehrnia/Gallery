import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: Number,
  style: String,
  image: String,
  thumbnail: String,
  readTime: String,

  descMain: String,

  image1: String,
  desc1: String,
  image1PublicId: String,

  image2: String,
  desc2: String,
  image2PublicId: String,

  image3: String,
  desc3: String,
  image3PublicId: String,

  image4: String,
  desc4: String,
  image4PublicId: String,

  image5: String,
  desc5: String,
  image5PublicId: String,

  public_id: String
});

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);