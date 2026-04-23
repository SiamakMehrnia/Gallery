export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "gallery_upload");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dr5h0ms9o/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
};