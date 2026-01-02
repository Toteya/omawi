import { useEffect, useRef, useState } from 'react'
import { getSongMelody, getMelodyMedia } from '../api/requests'
import { FaPlay, FaPause, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6'
import TrackMuteButton from './TrackMuteButton.jsx'

export default function MusicPlayer({ selectedSong }) {
  const audioContextRef = useRef(null)
  const sourcesRef = useRef([])
  const gainNodesRef = useRef([])
  const buffersRef = useRef([])
  const startTimeRef = useRef(0)
  const offsetTimeRef = useRef(0)
  const rafRef = useRef(null)
  const isPlayingRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [melodyError, setMelodyError] = useState(false)

  const [sopranoMuted, setSopranoMuted] = useState(false)
  const [altoMuted, setAltoMuted] = useState(false)
  const [tenorMuted, setTenorMuted] = useState(false)
  const [bassMuted, setBassMuted] = useState(false)

  async function ensureAudioContext() {
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) {
        throw new Error('Web Audio API not supported')
      }
      audioContextRef.current = new Ctx()
    }
    return audioContextRef.current
  }

  function stopSources() {
    const sources = sourcesRef.current
    sources.forEach((s) => {
      try { s.stop() } catch {}
    })
    sourcesRef.current = []
    isPlayingRef.current = false
    setIsPlaying(false)
    cancelAnimationFrame(rafRef.current)
  }

  function connectGraph() {
    const ctx = audioContextRef.current
    gainNodesRef.current = buffersRef.current.map(() => ctx.createGain())
    // initialize per-track volume
    gainNodesRef.current.forEach((g) => { g.gain.value = volume })
  }

  async function loadSong(song) {
    if (!song) return
    const ctx = await ensureAudioContext()
    stopSources()
    offsetTimeRef.current = 0
    // fetch melody path from API, build URLs for 4 voices
    const path = await getSongMelody(song.id)
    if (!path) {
      buffersRef.current = []
      setDuration(0)
      return
    }
    const urls = [
      `${path}/soprano.m4a`,
      `${path}/alto.m4a`,
      `${path}/tenor.m4a`,
      `${path}/bass.m4a`,
    ]
    const dataBuffers = await Promise.all(
      urls.map((u) => getMelodyMedia(u)
        .then((res) => res.arrayBuffer()) // convert response to raw binary
      )
    )
    buffersRef.current = await Promise.all(
      dataBuffers.map((buf) => ctx.decodeAudioData(buf))
    )
    connectGraph()
    const d = buffersRef.current[0]?.duration ?? 0
    setDuration(d)
    setCurrentTime(0)
  }

  function startPlayback() {
    const ctx = audioContextRef.current
    if (!ctx || buffersRef.current.length === 0) return
    const now = ctx.currentTime
    startTimeRef.current = now
    sourcesRef.current = []
    buffersRef.current.forEach((buf, index) => {
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.connect(gainNodesRef.current[index])
      gainNodesRef.current[index].connect(ctx.destination)
      src.onended = () => {
        sourcesRef.current = sourcesRef.current.filter((s) => s !== src)
        if (sourcesRef.current.length === 0) {
          isPlayingRef.current = false
          setIsPlaying(false)
          setCurrentTime(0)
          offsetTimeRef.current = 0
          cancelAnimationFrame(rafRef.current)
        }
      }
      sourcesRef.current.push(src)
      src.start(now + 0.2, offsetTimeRef.current)
    })
    if (ctx.state === 'running') {
      isPlayingRef.current = true
      setIsPlaying(true)
    }
    rafRef.current = requestAnimationFrame(updateProgress)
  }

  function updateProgress() {
    const ctx = audioContextRef.current
    if (!ctx) return

    let t = ctx.currentTime - startTimeRef.current + offsetTimeRef.current
    if (t < 0) t = 0

    const roundedTime = Math.floor(t * 20) / 20  // minimise frame updates to improve performance
    setCurrentTime(roundedTime)

    if (isPlayingRef.current) {
      rafRef.current = requestAnimationFrame(updateProgress)
    }
  }

  function togglePlayPause() {
    const ctx = audioContextRef.current
    if (!ctx) {
      ensureAudioContext().then(() => {
        startPlayback()
      }).catch(() => {})
      return
    }
    if (sourcesRef.current.length === 0) {
      ctx.resume().then(() => startPlayback())
      return
    }
    if (ctx.state === 'running') {
      ctx.suspend().then(() => {
        isPlayingRef.current = false
        setIsPlaying(false)
      })
    } else if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        isPlayingRef.current = true
        setIsPlaying(true)
        rafRef.current = requestAnimationFrame(updateProgress)
      })
    }
  }

  function onSeek(e) {
    const ctx = audioContextRef.current
    if (ctx?.state === 'running' && !isPlayingRef.current) {
      // prevent autoplay after seeking when song hasn't started
      ctx.suspend()
    }
    const progress = Number(e.target.value)
    if (buffersRef.current.length === 0) return
    offsetTimeRef.current = (duration * progress) / 100
    stopSources()
    startPlayback()
  }

  function setMasterVolume(v) {
    const tracksMuted = [sopranoMuted, altoMuted, tenorMuted, bassMuted]
    setVolume(v)
    gainNodesRef.current.forEach((g, index) => {
      if (tracksMuted[index]) return // skip muted tracks
      g.gain.value = v
    })
  }

  function toggleMuteTrack(index, muted) {
    const g = gainNodesRef.current[index]
    if (!g) return
    g.gain.value = !muted ? 0 : volume
  }

  function muteAll() {
    gainNodesRef.current.forEach((g) => { g.gain.value = 0 })
    setSopranoMuted(true)
    setAltoMuted(true)
    setTenorMuted(true)
    setBassMuted(true)
  }
  function unmuteAll() {
    gainNodesRef.current.forEach((g) => { g.gain.value = volume })
    setSopranoMuted(false)
    setAltoMuted(false)
    setTenorMuted(false)
    setBassMuted(false)
  }

  useEffect(() => {
    loadSong(selectedSong).catch(() => {
      setMelodyError(true)
    })
    setMelodyError(false)
    // cleanup on unmount
    return () => {
      stopSources()
      try { audioContextRef.current?.close() } catch {}
      audioContextRef.current = null
    }
  }, [selectedSong])

  const currentMinutes = Math.floor(currentTime / 60)
  const currentSeconds = Math.floor(currentTime % 60)
  const totalMinutes = Math.floor(duration / 60)
  const totalSeconds = Math.floor(duration % 60)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="MusicPlayer bg-white border rounded-lg p-4">
      <p className="mb-1">{selectedSong ? selectedSong.title : 'Select a song to hear the melody'}</p>
      {melodyError && <p className="text-red-500 mb-1 text-xs">Melody currently not available for this song</p>}
      <div className="flex justify-center gap-4 mb-4 mt-3">
        <button className="border rounded px-3 py-1" onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center text-lg">
            <FaVolumeHigh />
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <input
          type="range"
          min="0"
          max="100"
          step="0.01"
          value={progress}
          className="w-full"
          onChange={onSeek}
        />
        <div className="flex justify-between text-sm">
          <div>{currentMinutes}:{currentSeconds < 10 ? '0' : ''}{currentSeconds}</div>
          <div>{totalMinutes}:{totalSeconds < 10 ? '0' : ''}{totalSeconds}</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          className="border rounded px-3 py-1 flex flex-col items-center justify-center gap-1"
          onClick={muteAll}
          aria-label="Mute All"
        >
          <FaVolumeXmark />
          <span className="text-sm uppercase">All</span>
        </button>
        <button
          className="border rounded mr-4 px-3 py-1 flex flex-col items-center justify-center gap-1"
          onClick={unmuteAll}
          aria-label="Unmute All"
        >
          <FaVolumeHigh />
          <span className="text-sm uppercase">All</span>
        </button>
        <TrackMuteButton
          muteTrack={toggleMuteTrack}
          trackName="Soprano"
          trackIndex={0}
          trackMuted={sopranoMuted}
          setTrackMuted={setSopranoMuted}
        />
        <TrackMuteButton
          muteTrack={toggleMuteTrack}
          trackName="Alto"
          trackIndex={1}
          trackMuted={altoMuted}
          setTrackMuted={setAltoMuted}
        />
        <TrackMuteButton
          muteTrack={toggleMuteTrack}
          trackName="Tenor"
          trackIndex={2}
          trackMuted={tenorMuted}
          setTrackMuted={setTenorMuted}
        />
        <TrackMuteButton
          muteTrack={toggleMuteTrack}
          trackName="Bass"
          trackIndex={3}
          trackMuted={bassMuted}
          setTrackMuted={setBassMuted}
        />
      </div>
    </div>
  )
}
