export default function GreenButton({ children }) {
  return (
    <button
      className="
        px-6 py-2 rounded-full font-semibold
        bg-green-600 text-white
        hover:bg-white hover:text-black hover:border hover:border-gray-300
        transition-colors
      "
    >
      {children}
    </button>
  );
}
