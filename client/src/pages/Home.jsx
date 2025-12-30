import { useEffect, useState } from 'react'
import { getComposers, getSongs, getSongLyrics } from '../api/requests'
import MusicPlayer from '../components/MusicPlayer'

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)
  const [songs, setSongs] = useState([])
  const [composers, setComposers] = useState([])
  const [composerId, setComposerId] = useState('')
  const [query, setQuery] = useState('')
  const [selectedSong, setSelectedSong] = useState(null)
  const [lyrics, setLyrics] = useState([])

  useEffect(() => {
    getComposers().then(setComposers).catch(() => {})
  }, [])
  
  useEffect(() => {
    getSongs(composerId).then(setSongs).catch(() => {})
    // TO DO: handle errors; loading state indicator
  }, [composerId])
  
  useEffect(() => {
    if (!selectedSong) {
      setLyrics([])
      return
    }
    getSongLyrics(selectedSong.id).then(setLyrics).catch(() => setLyrics([]))
  }, [selectedSong])
  
  const visibleSongs = songs.filter((s) =>
    (s.title ?? '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="Page space-y-6">
      <div className="Toolbar flex items-center gap-4 relative z-50">
        <button
          className="BurgerButton md:hidden border rounded px-3 py-2"
          aria-label="Toggle menu"
          aria-expanded={showMenu}
          onClick={() => setShowMenu((visible) => !visible)}
        >
          ☰
        </button>
        <input
          type="search"
          placeholder="Search songs"
          className="border rounded-md px-3 py-2 w-full max-w-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
            {visibleSongs.length > 0 ? (
              visibleSongs.map((song) => (
                <li key={song.id}>
                  <a
                    href="#"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedSong(song)
                    }}
                  >
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
          <MusicPlayer selectedSong={selectedSong} />
          <div className="mt-6">
            <div className="bg-white border rounded-lg p-4 min-h-24">
              {!selectedSong ? (
                <p><em>-- Lyrics --</em></p>
              ) : (
                lyrics.length > 0 ? (
                  lyrics.map((verse) => (
                    <div key={verse.id} className="mb-2">
                      <h4 className="font-semibold">{verse.number}.</h4>
                      <p>{verse.lyrics}</p>
                    </div>
                  ))
                ) : (
                  <div>
                    <p><em>Lyrics currently unavailable for this song.</em></p>
                    <p><em>Please try again later.</em></p>
                  </div>
                )
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
