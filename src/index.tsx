import { serve } from "bun";
import { commonResponseHeaders } from "./constants";
import { handleChat } from "./handlers/handleChat";
import index from "./index.html";

const BASE_PATH = "./public";

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
	async fetch(req) {
		const filePath = BASE_PATH + new URL(req.url).pathname;
		const file = Bun.file(filePath);

		if (!(await file.exists())) {
			return new Response("Not Found", { status: 404 });
		}

		return new Response(file);
	},
	development: process.env.NODE_ENV !== "production" && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
});

console.log(`Server running at ${server.url}`);
