export default function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="fade-up mx-auto mt-10 flex max-w-sm flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
        <Icon size={26} />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-400">{text}</p>
    </div>
  );
}