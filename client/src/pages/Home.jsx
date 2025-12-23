import { useEffect, useState } from 'react'
import { getComposers, getSongs } from '../api/requests'
import MusicPlayer from '../components/MusicPlayer'

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)
  const [songs, setSongs] = useState([])
  const [composers, setComposers] = useState([])
  const [composerId, setComposerId] = useState('')

  useEffect(() => {
    getComposers().then(setComposers).catch(() => {})
  }, [])
  
  useEffect(() => {
    getSongs(composerId).then(setSongs).catch(() => {})
    // TO DO: handle errors; loading state indicator
  }, [composerId])
  
  return (
    <div className="Page space-y-6">
      <div className="flex items-center gap-4">
        <button
          className="BurgerButton md:hidden border rounded px-3 py-2"
          aria-label="Toggle menu"
          aria-expanded={showMenu}
          onClick={() => setShowMenu((visible) => !visible)}
        >
          ☰
        </button>
        <input
          type="text"
          placeholder="Search songs"
          className="border rounded-md px-3 py-2 w-full max-w-sm"
        />
        <select
          className="border rounded-md px-3 py-2"
          value={composerId}
          onChange={(e) => setComposerId(e.target.value)}
        >
          <option value="">All Composers</option>
          {composers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {showMenu && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
          aria-hidden="true"
        />
      )}
      <div className="flex gap-6">
        <aside className={`${showMenu ? 'block' : 'hidden'} md:block w-52 z-50 relative`}>
          <p className="font-semibold mb-2">Songs</p>
          <ul
            className="space-y-1 max-h-64 overflow-y-auto border rounded-md p-2"
            onClick={(e) => {
              if (e.target.closest('a')) setShowMenu(false)
            }}
          >
            {songs.length > 0 ? (
              songs.map((song) => (
                <li key={song.id}>
                  <a href="#" className="block px-2 py-1 rounded hover:bg-gray-100">
                    {song.title}
                  </a>
                </li>
              ))
            ) : (
              <li>
                <em>No matches</em>
              </li>
            )}
          </ul>
        </aside>
        <main className="flex-1">
          <MusicPlayer />
          <div className="mt-6">
            <div className="border rounded-lg p-4 min-h-24">Lyrics</div>
          </div>
        </main>
      </div>
    </div>
  )
}
