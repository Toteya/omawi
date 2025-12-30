import { FaVolumeXmark, FaVolumeHigh } from "react-icons/fa6"

const TrackMuteButton = ({muteTrack, trackName, trackIndex, trackMuted, setTrackMuted}) => {
  return (
    <button
      className="border rounded px-3 py-1 flex flex-col items-center justify-center gap-1"
      onClick={() => {
        muteTrack(trackIndex, trackMuted)
        setTrackMuted(!trackMuted)
      }}
    >
      {trackMuted ? <FaVolumeXmark className="text-red-500"/> : <FaVolumeHigh />}
      <span className="text-sm uppercase">{trackName}</span>
    </button>
  )
}

export default TrackMuteButton