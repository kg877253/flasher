import api from "./axios";

export const getAllVideos = async (params) => {
  const res = await api.get("/videos", { params });
  return res.data.data; // { allvideos, page, hasNextPage, ... }
};

export const getVideoById = async (id) => {
  const res = await api.get(`/videos/${id}`);

  return res.data.data; // { videoFile, title, description, ... }
}

// formData fields: title, description, videoFile, thumbnail
export const publishVideo = async (formData, onProgress) => {
  const res = await api.post("/videos", formData, {
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });
  return res.data.data;
};

// formData fields (all optional, but at least one): title, description, thumbnail
export const updateVideo = async (videoId, formData) => {
  const res = await api.patch(`/videos/${videoId}`, formData);
  return res.data.data;
};

export const deleteVideo = async (videoId) => {
  await api.delete(`/videos/${videoId}`);
};

export const toggleVideoPublish = async (videoId) => {
  const res = await api.patch(`/videos/toggle/publish/${videoId}`);
  return res.data.data; // the updated video, check isPublished
};