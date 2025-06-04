const DashboardTabs = ({ selected, setSelected }) => (
  <div className="flex justify-center mb-6">
    <div className="inline-flex gap-2 rounded-lg border border-[#ddd1be] bg-white shadow-md px-2 py-1">
      {["global", "gallery"].map((tab) => (
        <button
          key={tab}
          onClick={() => setSelected(tab)}
          className={`px-6 py-3 rounded-lg text-base font-semibold transition duration-200 ${
            selected === tab
              ? "bg-[#3d2e1e] text-white"
              : "bg-[#f6f1ea] text-[#3d2e1e] hover:bg-[#e9dfd0]"
          }`}
        >
          {tab === "global" ? "🎨 Global Art" : "🖼️ Gallery"}
        </button>
      ))}
    </div>
  </div>
);

export default DashboardTabs;