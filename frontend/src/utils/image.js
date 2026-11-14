// Adds Cloudinary transformations to an image url:
// f_auto = best format for the browser (WebP/AVIF), q_auto = smart quality, w/h = resize
// Any other url (Google photo, blob preview, ui-avatars) is returned unchanged.
export function optimizeImage(url, { width, height, crop = "limit", gravity } = {}) {
  if (typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;

  const options = ["f_auto", "q_auto"];
  if (width) options.push(`w_${width}`);
  if (height) options.push(`h_${height}`);
  if (width || height) options.push(`c_${crop}`);
  if (gravity) options.push(`g_${gravity}`);

  return url.replace("/image/upload/", `/image/upload/${options.join(",")}/`);
}

// Widths are about 2x the size shown on screen so they stay sharp on retina screens
export const imgThumb = (url, width = 800) => optimizeImage(url, { width });

export const imgAvatar = (url, size = 96) =>
  optimizeImage(url, { width: size, height: size, crop: "fill", gravity: "auto" });

export const imgCover = (url, width = 1600) => optimizeImage(url, { width });