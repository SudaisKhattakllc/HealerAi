import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css"
import AboutUs from "./Components/AboutUS/AboutUS";
import Blog from "./Components/Blog/Blog";
import ContactUS from "./Components/ContactUS/ContactUS";
import FindDoctors from "./Components/FindDoctors/FindDoctors";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<AboutUs/>} />
      <Route path="/blog" element={<Blog/>} />
      <Route path="/contact" element={<ContactUS/>} />
      <Route path="/finddoctors" element={<FindDoctors/>}/>



    </Routes>
  </BrowserRouter>
  </AuthProvider>
);
