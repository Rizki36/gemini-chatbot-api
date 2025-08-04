/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

// Create root and render app
createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
