

import { useState, useEffect } from "react";

export default function GlobalArtForm({ onAdd, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    year: "",
    style: "",
    image: "",
    thumbnail: "",
    description: "",
    readTime: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await fetch(
        initialData ? `/api/global/${initialData._id}` : "/api/global",
        {
          method: initialData ? "PUT" : "POST",
          body: form,
        }
      );

      const result = await response.json();
      console.log("Success:", result);

      if (response.ok) {
        alert(`Artwork ${initialData ? "updated" : "created"} successfully!`);
        setFormData({
          title: "",
          artist: "",
          year: "",
          style: "",
          image: "",
          thumbnail: "",
          description: "",
          readTime: "",
        });
      } else {
        alert("Failed to save artwork.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  const fields = [
    "title",
    "artist",
    "year",
    "style",
    "description",
    "readTime",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-10 max-w-4xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-[#3d2e1e]">
        {initialData ? "Edit Global Artwork" : "Add New Global Artwork"}
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium">Main Image</label>
        <input
          type="file"
          name="image"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
          }
          className="w-full border px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, thumbnail: e.target.files[0] }))
          }
          className="w-full border px-3 py-2 rounded text-sm"
        />
      </div>

      {fields.map((field) => (
        <textarea
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm"
          rows={field === "description" ? 6 : 2}
        />
      ))}

      <button
        type="submit"
        className="bg-[#3d2e1e] text-white px-4 py-2 rounded hover:bg-[#5a3d28]"
      >
        {initialData ? "Update" : "Add"}
      </button>
    </form>
  );
}