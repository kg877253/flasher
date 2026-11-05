import { useState } from 'react'
import viteLogo from './assets/vite.svg'
import {ShieldCheck, Bell , ArrowDown, ArrowDown2 } from 'reicon-react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home"

function App() {

  const router = createBrowserRouter([
    {
      path : "/",
      element : <Home />
    },
    {
      path : "/home",
      element : <Home />
    }
  ])
  return (
    <RouterProvider router={router} />
    )
}

export default App
