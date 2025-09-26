export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Celestial Hymns OBS Plugin</h1>
      <p className="text-lg mb-4">
        Use the Dock for control, and the Display as a Browser Source in OBS.
      </p>
      <div className="space-x-4">
        <a href="/dock" className="px-6 py-3 bg-blue-600 text-white rounded-lg">Go to Dock</a>
        <a href="/display" className="px-6 py-3 bg-green-600 text-white rounded-lg">Go to Display</a>
      </div>
    </main>
  );
}