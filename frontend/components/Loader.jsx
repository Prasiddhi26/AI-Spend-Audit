const Loader = () => (
  <div className="flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
    <p className="text-sm text-gray-500 tracking-wide">Running audit...</p>
  </div>
);

// Preview: centered on screen
export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader />
    </div>
  );
}