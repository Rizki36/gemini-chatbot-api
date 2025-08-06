import { serve } from "bun";
import { commonResponseHeaders } from "./constants";
import { handleChat } from "./handlers/handleChat";

import index from "./index.html";

const server = serve({
	routes: {
		"/": index,
		"/api/chat": {
			async POST(req) {
				const headers = new Headers(commonResponseHeaders);
				return handleChat(req, headers);
			},
		},
	},
	development: process.env.NODE_ENV !== "production" && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
});

console.log(`Server running at ${server.url}`);
