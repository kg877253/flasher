import { getLikedVideos } from "../api/like.api";
import VideoCollection from "./VideoCollection";

export default function LikedVideos() {
  return <VideoCollection type="liked" fetchVideos={getLikedVideos} />;
}
