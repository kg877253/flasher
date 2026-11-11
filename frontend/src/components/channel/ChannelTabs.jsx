import { useSearchParams } from "react-router-dom";
import VideosTab from "./VideosTab";
import PlaylistsTab from "./PlaylistsTab";
import TweetsTab from "./TweetsTab";
import FollowingTab from "./FollowingTab";

const TABS = [
  { id: "videos", label: "Videos" },
  { id: "playlists", label: "Playlists" },
  { id: "tweets", label: "Tweets" },
  { id: "following", label: "Following" },
];

export default function ChannelTabs({ channel }) {
  // The active tab lives in the URL (?tab=tweets), so refresh and back/forward keep it
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const activeIndex = Math.max(
    TABS.findIndex((t) => t.id === tabFromUrl),
    0 // unknown or missing tab -> Videos
  );
  const active = TABS[activeIndex].id;

  return (
    <div className="mt-6">
      {/* Tab bar: one glass pill slides under the active tab */}
      <div className="px-2 sm:px-4">
        <div
          role="tablist"
          className="relative grid max-w-xl grid-cols-4 rounded-full border border-white/10 bg-white/5 p-1"
        >
          <div
            className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/4)] rounded-full border border-white/20 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setSearchParams({ tab: tab.id }, { replace: true })}
              className={`relative z-10 cursor-pointer rounded-full py-2 text-sm font-medium transition-colors ${
                active === tab.id ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* key={active} remounts the panel, so it fetches and fades in on every tab change */}
      <div key={active} className="fade-up mt-5 px-2 sm:px-4">
        {active === "videos" && <VideosTab channelId={channel._id} />}
        {active === "playlists" && <PlaylistsTab channelId={channel._id} />}
        {active === "tweets" && <TweetsTab channel={channel} />}
        {active === "following" && <FollowingTab channelId={channel._id} />}
      </div>
    </div>
  );
}