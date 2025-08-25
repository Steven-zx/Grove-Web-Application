export default function SidebarButton({ icon, label, active = false }) {
  return (
    <button
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg w-full text-left
        ${active ? "bg-[#E5EBE0] text-gray-900" : "bg-white text-gray-800"}
        hover:bg-[#EFEFEF] transition-colors
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
