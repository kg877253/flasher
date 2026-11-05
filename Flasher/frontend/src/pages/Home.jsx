import VideoCard from "../components/Videocard";

const dummyVideos = Array.from({ length: 8 }, (_, i) => ({
  _id: String(i),
  title: `Sample video title ${i + 1}`,
  thumbnail: "",
  views: 100000,
  createdAt: new Date().toISOString(),
  owner: { username: "flasher", avatar: "" },
}));

export default function Home() {
  const videos = dummyVideos; // Phase 4 me API se aayega

  if (videos.length === 0) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-md border border-gray-500 p-6 text-center">
        <h1 className="text-2xl font-bold">No Videos available</h1>
        <p className="mt-2 text-sm text-gray-400">
          There are no videos here. Try searching for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((v) => (
        <VideoCard key={v._id} video={v} />
      ))}
    </div>
  );
}