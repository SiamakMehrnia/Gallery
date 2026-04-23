import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

export default function GalleryArtForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    year: "",
    style: "",
    readTime: "",
    descMain: "",
    desc1: "",
    desc2: "",
    desc3: "",
    desc4: "",
    desc5: "",
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        artist: initialData.artist || "",
        year: initialData.year?.toString() || "",
        style: initialData.style || "",
        readTime: initialData.readTime || "",
        descMain: initialData.descMain || "",
        desc1: initialData.desc1 || "",
        desc2: initialData.desc2 || "",
        desc3: initialData.desc3 || "",
        desc4: initialData.desc4 || "",
        desc5: initialData.desc5 || "",
        image: null,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      if (file) {
        const fileName = file.name.toLowerCase();
        const fileType = (file.type || "").toLowerCase();
        const isHeic =
          fileType.includes("heic") ||
          fileType.includes("heif") ||
          fileName.endsWith(".heic") ||
          fileName.endsWith(".heif");

        if (isHeic) {
          Swal.fire({
            icon: "warning",
            title: "Unsupported image format",
            text: "Please upload JPG, JPEG, PNG, or WEBP files. On iPhone, go to Settings > Camera > Formats > Most Compatible.",
          });

          e.target.value = "";
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImageToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dr5h0ms9o";
    const uploadPreset = "gallery_upload";

    let optimizedFile = file;

    if (file.size > 5 * 1024 * 1024) {
      optimizedFile = await imageCompression(file, {
        maxSizeMB: 5,
        maxWidthOrHeight: 2500,
        initialQuality: 0.9,
        useWebWorker: true,
      });
    }

    const uploadData = new FormData();
    uploadData.append("file", optimizedFile);
    uploadData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error?.message || "Cloudinary upload failed.");
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image && !initialData?.image) {
      Swal.fire({
        icon: "warning",
        title: "Main image required",
        text: "Please select the main image before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const imageFields = ["image", "image1", "image2", "image3", "image4", "image5"];

      const uploadedImages = await Promise.all(
        imageFields.map(async (field) => {
          const file = formData[field];

          if (!file) {
            if (initialData?.[field]) {
              return { field, url: initialData[field], public_id: initialData?.public_id || "" };
            }
            return { field, url: "", public_id: "" };
          }

          const uploaded = await uploadImageToCloudinary(file);
          return { field, url: uploaded.url, public_id: uploaded.public_id };
        })
      );

      const payload = {
        title: formData.title,
        artist: formData.artist,
        year: formData.year,
        style: formData.style,
        readTime: formData.readTime,
        descMain: formData.descMain,
        desc1: formData.desc1,
        desc2: formData.desc2,
        desc3: formData.desc3,
        desc4: formData.desc4,
        desc5: formData.desc5,
        public_id: uploadedImages.find((item) => item.field === "image")?.public_id || initialData?.public_id || "",
      };

      uploadedImages.forEach((item) => {
        payload[item.field] = item.url;
      });

      const response = await fetch(
        initialData ? `/api/gallery/${initialData._id}` : "/api/gallery",
        {
          method: initialData ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const raw = await response.text();
      console.log("STATUS:", response.status);
      console.log("RAW RESPONSE:", raw);

      if (!response.ok) {
        throw new Error(`Failed to submit | status: ${response.status} | ${raw}`);
      }

      const result = raw ? JSON.parse(raw) : null;
      console.log("Success:", result);
      Swal.fire({
        icon: "success",
        title: initialData ? "Artwork updated successfully!" : "Artwork added successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error!",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded shadow">
      {["title", "artist", "year", "style", "readTime", "descMain", "desc1", "desc2", "desc3", "desc4", "desc5"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={formData[field]}
          onChange={handleChange}
          className="block w-full p-2 border rounded"
        />
      ))}

      {["image", "image1", "image2", "image3", "image4", "image5"].map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input
            type="file"
            name={field}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            className="block w-full"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {isSubmitting ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}