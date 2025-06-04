import mongoose from "mongoose";

const GlobalArtSchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: Number,
  style: String,
  image: String,
  thumbnail: String,
  description: String,
  readTime: String,
});

export default mongoose.models.GlobalArt || mongoose.model("GlobalArt", GlobalArtSchema);