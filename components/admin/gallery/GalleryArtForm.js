import Swal from "sweetalert2";
import { useState, useEffect } from "react";

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
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const convertIfHeic = async (file) => {
    if (!file) return null;

    const isHeic = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");
    if (!isHeic) return file;

    if (typeof window === "undefined") {
      return file;
    }

    try {
      const { default: heic2any } = await import("heic2any");

      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      });

      const blob = Array.isArray(converted) ? converted[0] : converted;

      return new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
        type: "image/jpeg",
      });
    } catch (err) {
      console.error("HEIC conversion failed:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // DEBUG: log formData before sending
    console.log("FORM STATE:", formData);

    // process main image
    if (formData.image) {
      const processedMain = await convertIfHeic(formData.image);
      if (processedMain) data.append("image", processedMain);
    }

    // process other fields
    for (let key in formData) {
      if (key === "image") continue;

      const value = formData[key];

      if (!value || value === "") continue;

      // if it's a file field
      if (key.startsWith("image")) {
        const processed = await convertIfHeic(value);
        if (processed) data.append(key, processed);
      } else {
        data.append(key, value);
      }
    }

    // DEBUG: log FormData entries
    for (const pair of data.entries()) {
      console.log("FORMDATA:", pair[0], pair[1]);
    }

    try {
      const response = await fetch(
        initialData ? `/api/gallery/${initialData._id}` : "/api/gallery",
        {
          method: initialData ? "PUT" : "POST",
          body: data,
        }
      );

      const raw = await response.text();
      console.log("STATUS:", response.status);
      console.log("RAW RESPONSE:", raw);

      if (!response.ok) {
        throw new Error(`Failed to submit | status: ${response.status} | ${raw}`);
      }

      const result = JSON.parse(raw);
      console.log("Success:", result);
      Swal.fire({
        icon: 'success',
        title: initialData ? 'Artwork updated successfully!' : 'Artwork added successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error!',
        text: 'Something went wrong. Please try again.',
      });
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
          <input type="file" name={field} onChange={handleChange} className="block w-full" />
        </div>
      ))}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}