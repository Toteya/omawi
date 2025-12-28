import { FaVolumeXmark, FaVolumeHigh } from "react-icons/fa6"

const TrackMuter = ({muteTrack, trackName, trackIndex, trackMuted, setTrackMuted}) => {
  return (
    <button
      className="border rounded px-3 py-1 inline-flex items-center gap-2"
      onClick={() => {
        muteTrack(trackIndex, trackMuted)
        setTrackMuted(!trackMuted)
      }}
    >{trackMuted ? <FaVolumeXmark className="text-red-500"/> : <FaVolumeHigh />} <span>{trackName}</span></button>
  )
}

export default TrackMuter