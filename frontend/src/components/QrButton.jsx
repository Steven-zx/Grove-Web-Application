export default function QrButton({ children }) {
  return (
    <button
      className="
        flex items-center justify-center gap-2 px-5 py-3 rounded-lg
        bg-white text-gray-700 border border-gray-200
        hover:text-green-600 hover:border-green-400
        transition-colors
      "
    >
      {children}
    </button>
  );
}
