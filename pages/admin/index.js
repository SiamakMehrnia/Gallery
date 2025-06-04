import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTabs from "@/components/admin/DashboardTabs";
import GalleryArtForm from "@/components/admin/gallery/GalleryArtForm";
import GalleryArtList from "@/components/admin/gallery/GalleryArtList";
import GlobalArtForm from "@/components/admin/globalArt/GlobalArtForm";
import GlobalArtList from "@/components/admin/globalArt/GlobalArtList";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("global");
  const [galleryArt, setGalleryArt] = useState([]);
  const [globalArt, setGlobalArt] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editingGlobal, setEditingGlobal] = useState(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("adminLoggedIn") !== "true"
    ) {
      router.push("/admin/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const galleryRes = await fetch("/api/gallery");
        const galleryData = await galleryRes.json();
        setGalleryArt(galleryData);

        const globalRes = await fetch("/api/global");
        const globalData = await globalRes.json();
        setGlobalArt(globalData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleAddGallery = (art) => {
    if (editing) {
      setGalleryArt((prev) =>
        prev.map((item) => (item.id === editing.id ? art : item))
      );
      setEditing(null);
    } else {
      setGalleryArt((prev) => [...prev, { ...art, id: Date.now() }]);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    const formElement = document.getElementById("gallery-art-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = (id, type) => {
    if (type === "global") {
      // This block is now redundant but kept for safety
      // since "global" tab is removed, it won't be called
      return;
    } else {
      setGalleryArt((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddGlobal = (art) => {
    if (editingGlobal) {
      setGlobalArt((prev) =>
        prev.map((item) => (item._id === editingGlobal._id ? art : item))
      );
      setEditingGlobal(null);
    } else {
      setGlobalArt((prev) => [...prev, art]);
    }
  };

  const handleEditGlobal = (item) => {
    setEditingGlobal(item);
  };

  const handleDeleteGlobal = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this artwork?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/global/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server responded with:", errorText);
        throw new Error("Failed to delete");
      }

      setGlobalArt((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
    <AdminLayout>
      <div className="flex justify-end mb-4 ">
        <button
          onClick={() => {
            localStorage.removeItem("adminLoggedIn");
            router.push("/admin/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <DashboardTabs selected={tab} setSelected={setTab} />
      <div className="space-y-8">
        {tab === "gallery" && (
          <div>
            <div id="gallery-art-form">
              <GalleryArtForm
                key={editing?._id || "new"}
                onAdd={handleAddGallery}
                initialData={editing}
              />
            </div>
            <GalleryArtList
              items={galleryArt}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete(id, "gallery")}
            />
          </div>
        )}
        {tab === "global" && (
          <div>
            <GlobalArtForm onAdd={handleAddGlobal} initialData={editingGlobal} />
            <GlobalArtList
              items={globalArt}
              onEdit={handleEditGlobal}
              onDelete={handleDeleteGlobal}
            />
          </div>
        )}
      </div>
    </AdminLayout>
        </>
  );
}