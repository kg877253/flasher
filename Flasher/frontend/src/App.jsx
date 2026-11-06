import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      // baad me: login, register, watch/:id, channel/:username
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path:"/login",
    element : <Login/>
  },
  {
    path:"/register",
    element : <SignUp/>
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}