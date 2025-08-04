import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import env from "../config";
import { fileToGenerativePart, isSupportedFileType } from "../utils";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Handles text and document generation requests.
 */
export async function handleChat(req: Request, headers: Headers) {
	try {
		const formData = await req.formData();
		const text = formData.get("text")?.toString() || "";
		const file = formData.get("file") as File | null;

		let validationError = null;

		if (!text || text.trim() === "") {
			validationError = "Text input is required";
		}

		if (validationError) {
			return new Response(JSON.stringify({
				success: false,
				error: validationError
			}), {
				status: 400,
				headers: { ...headers, "Content-Type": "application/json" },
			});
		}

		// Select the appropriate model based on whether we have a file
		const modelName = file ? env.GEMINI_VISION_MODEL : env.GEMINI_MODEL;
		const model = genAI.getGenerativeModel({ model: modelName });

		const parts: (string | Part)[] = [text];

		// Process the file if present
		if (file) {
			if (!isSupportedFileType(file.type)) {
				return new Response(JSON.stringify({
					success: false,
					error: `Unsupported file type: ${file.type}`
				}), {
					status: 400,
					headers: { ...headers, "Content-Type": "application/json" },
				});
			}

			const fileBuffer = Buffer.from(await file.arrayBuffer());

			// For other supported files, add them directly as a part
			const imagePart = fileToGenerativePart(fileBuffer, file.type);
			parts.push(imagePart);
		}

		const result = await model.generateContent(parts);
		const response = result.response;

		return new Response(
			JSON.stringify({
				success: true,
				data: response.text(),
				model: modelName,
			}),
			{
				status: 200,
				headers: { ...headers, "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error in handleChat:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			}),
			{
				status: 500,
				headers: { ...headers, "Content-Type": "application/json" },
			},
		);
	}
}
