import { serve } from "bun";
import index from "./index.html";

const server = serve({
	routes: {
		// Serve index.html for all unmatched routes.
		"/*": index,

		"/api/chat": {
			async POST(req) {
				return Response.json({
					message: "Hello, world!",
					method: "GET",
				});
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
