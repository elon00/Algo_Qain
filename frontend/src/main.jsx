import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
createRoot(container).render(<App />);

// The following commands were suggested to fix a network issue
// ipconfig /flushdns
// netsh winsock reset
// then reboot the system (required by winsock reset)
