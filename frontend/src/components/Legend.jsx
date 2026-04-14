export default function Legend() {
  const items = [
    { label: "Available", className: "bg-green-500" },
    { label: "Selected", className: "bg-blue-500" },
    { label: "Booked", className: "bg-red-500" },
    { label: "Locked", className: "bg-yellow-400" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#af8782]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-sm ${item.className}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
