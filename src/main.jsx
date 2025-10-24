import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AnimatedBackground from "./components/AnimatedBackground";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
    
    <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
      </div>
    <div className="relative z-10">
      <App />
    
    </div>
    </BrowserRouter>
  </Provider>
);
