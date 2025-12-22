export default function Home() {
  return (
    <div className="Page space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search songs"
          className="border rounded-md px-3 py-2 w-full max-w-sm"
        />
        <select className="border rounded-md px-3 py-2">
          <option>All Composers</option>
        </select>
      </div>
      <div className="flex gap-6">
        <aside className="hidden md:block w-52">
          <p className="font-semibold mb-2">Songs</p>
          <ul className="space-y-1 max-h-64 overflow-y-auto border rounded-md p-2">
            <li>
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-100">Library</a>
            </li>
            <li>
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-100">Song Title A</a>
            </li>
            <li>
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-100">Song Title B</a>
            </li>
            <li>
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-100">Song Title C</a>
            </li>
          </ul>
        </aside>
        <main className="flex-1">
          <div className="border rounded-lg p-4">
            <p className="mb-4">Select a song to hear the melody</p>
            <div className="flex items-center gap-4 mb-4">
              <button className="border rounded px-3 py-1">Play</button>
              <button className="border rounded px-3 py-1">Tools</button>
              <div className="flex items-center gap-2">
                <span>Volume</span>
                <input type="range" min="0" max="1" step="0.01" defaultValue="1" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <input type="range" min="0" max="100" step="0.01" defaultValue="0" className="w-full" />
              <div className="flex justify-between text-sm">
                <div>0:00</div>
                <div>0:00</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="border rounded px-3 py-1">Mute All</button>
              <button className="border rounded px-3 py-1">Unmute All</button>
              <button className="border rounded px-3 py-1">Soprano</button>
              <button className="border rounded px-3 py-1">Alto</button>
              <button className="border rounded px-3 py-1">Tenor</button>
              <button className="border rounded px-3 py-1">Bass</button>
            </div>
          </div>
          <div className="mt-6">
            <div className="border rounded-lg p-4 min-h-24">Lyrics</div>
          </div>
        </main>
      </div>
    </div>
  )
}
