import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
document.body.className = "bg-stone-800 text-stone-100 px-12 py-16";
document.getElementById("root").className = "max-w-screen-xl mx-auto";
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
