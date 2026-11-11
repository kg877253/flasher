import { getWatchHistory } from "../api/user.api";
import VideoCollection from "./VideoCollection";

export default function WatchHistory() {
  return <VideoCollection type="history" fetchVideos={getWatchHistory} />;
}
