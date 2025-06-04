import { useEffect, useState } from "react";
import GalleryArtCard from "./GalleryArtCard";
import GalleryArtForm from "./GalleryArtForm";

const GalleryArtList = () => {
  const [items, setItems] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setItems(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleEdit = (art) => {
    console.log("Selected art for editing:", art); // log selected art
    setSelectedArt(null); // clear first to force re-render
    setTimeout(() => {
      setSelectedArt(art);
      setIsModalOpen(true);
    }, 0);
  };

  const handleCloseModal = () => {
    setSelectedArt(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((art) => (
            <GalleryArtCard
              key={art._id}
              art={art}
              onEdit={handleEdit}
              onDelete={() => handleDelete(art._id)}
            />
          ))}
        </div>
      </div>

      {isModalOpen && selectedArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl relative mx-4 my-10">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <div className="max-h-[80vh] overflow-y-auto pr-2">
              <GalleryArtForm
                key={selectedArt._id}
                initialData={selectedArt}
                onUpdateSuccess={async () => {
                  setIsModalOpen(false);
                  setSelectedArt(null);
                  const res = await fetch("/api/gallery");
                  const data = await res.json();
                  setItems(data);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryArtList;
