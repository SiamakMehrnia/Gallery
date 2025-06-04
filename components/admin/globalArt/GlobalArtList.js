import GlobalArtCard from "./GlobalArtCard";

const GlobalArtList = ({ items, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-[#faf4ee] rounded-xl shadow-inner">
    {items.map((art) => (
      <GlobalArtCard key={art._id} art={art} onEdit={onEdit} onDelete={() => onDelete(art._id)} />
    ))}
  </div>
);

export default GlobalArtList;