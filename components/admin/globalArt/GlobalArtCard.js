const GlobalArtCard = ({ art, onEdit, onDelete }) => (
  <div
    className="border p-4 rounded-xl shadow bg-white flex flex-col hover:shadow-lg transition"
    title={`Artwork: ${art.title} by ${art.artist}`}
  >
    <img
      src={art.image}
      alt={art.title}
      className="h-48 object-cover rounded mb-3"
    />
    <h3 className="font-bold text-lg text-[#3d2e1e]">{art.title}</h3>
    <p className="text-sm text-gray-600 mb-2">
      {art.artist} ({art.year})
    </p>
    <div className="mt-auto flex justify-between gap-2 pt-2">
      <button
        onClick={() => onEdit(art)}
        className="text-blue-600 hover:text-blue-800 transition"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(art.id)}
        className="text-red-600 hover:text-red-800 transition"
      >
        Delete
      </button>
    </div>
  </div>
);

export default GlobalArtCard;
