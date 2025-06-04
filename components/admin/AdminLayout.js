

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefaf6] to-[#fdf8f2] p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#3d2e1e]">🎨 Admin Dashboard</h1>
          <p className="text-sm text-[#7c6752]">Manage your gallery and global artworks with ease</p>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}