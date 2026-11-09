import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Video from "./pages/Video";
import NotFound from "./pages/NotFound";
import Channel from "./pages/Channel";
import Playlist from "./pages/Playlist";
import LikedVideos from "./pages/LikedVideos";
import WatchHistory from "./pages/WatchHistory";
import Subscribers from "./pages/Subscribers";

const router = createBrowserRouter([
  {
    // Only for logged-out users
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <SignUp /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public
      { index: true, element: <Home /> },

      // Only for logged-in users
      {
        element: <ProtectedRoute />,
        children: [
          { path: "videos/:id", element: <Video /> },
          { path: "playlists/:playlistId", element: <Playlist /> },
          { path: "liked", element: <LikedVideos /> },
          { path: "history", element: <WatchHistory /> },
          { path: "subscribers", element: <Subscribers /> },

          {
            path: "users/channel/:username",
            element: <Channel />,
          }
          // more protected pages go here later
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },

]);

export default function App() {
  return <RouterProvider router={router} />;
}