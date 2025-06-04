const formatToJpg = (url) => url?.replace("/upload/", "/upload/f_jpg/");

const GalleryArtCard = ({ art, onEdit, onDelete }) => (
  <div className="border p-4 rounded shadow bg-white flex flex-col">
    <img
      src={formatToJpg(art.image)}
      alt={art.title}
      className="h-48 object-cover rounded mb-2"
    />
    <h3 className="font-bold text-lg">{art.title}</h3>
    <p className="text-sm text-gray-500">
      {art.artist} ({art.year})
    </p>
    <div className="mt-auto flex justify-between gap-2 pt-2">
      <button
        onClick={() => onEdit(art)}
        className="text-blue-600 hover:underline"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(art.id)}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  </div>
);

export default GalleryArtCard;
