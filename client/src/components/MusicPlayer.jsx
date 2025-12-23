const MusicPlayer = () => {
  return (
      <div className="MusicPlayer border rounded-lg p-4">
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
  )
}

export default MusicPlayer