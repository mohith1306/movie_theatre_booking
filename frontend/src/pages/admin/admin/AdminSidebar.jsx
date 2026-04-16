export default function AdminSidebar({ sections, activeSection, onSelect }) {
  return (
    <nav className="glass-panel rounded-xl p-4 border border-white/10 sticky top-24">
      <p className="text-xs uppercase tracking-[0.2em] text-[#af8782] px-2 mb-3">Admin Modules</p>
      <div className="space-y-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-colors ${
                isActive ? "bg-[#e50914] text-white" : "bg-white/5 hover:bg-white/10 text-[#f0ddd8]"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
