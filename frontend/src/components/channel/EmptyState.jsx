export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="fade-up mx-auto mt-10 flex max-w-sm flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-gray-400 ring-1 ring-white/10">
        <Icon size={26} />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-400">{text}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}