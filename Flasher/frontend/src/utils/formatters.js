export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const n = Math.floor(seconds / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

export const formatDuration = (sec = 0) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const formatViews = (views = 0) => {
  const count = new Intl.NumberFormat("en", { notation: "compact" }).format(views);
  return `${count} ${views === 1 ? "view" : "views"}`;
};

export const formatSubscribers = (count = 0) => {
  const text = new Intl.NumberFormat("en", { notation: "compact" }).format(count);
  return `${text} ${count === 1 ? "subscriber" : "subscribers"}`;
};