import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Styles.css";

// --- Sentry Integration ---
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://11115bac584e5c3f9816ac790f412c04@o4509354798678016.ingest.us.sentry.io/4509354820304896",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // Adjust to 0.1 in production if needed
});

// Optional: Attach IP address (can be commented out if not needed)
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    Sentry.setUser({ ip_address: data.ip });
  });

// Create root element and render App within React.StrictMode
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
