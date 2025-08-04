import { Part } from "@google/generative-ai";

/**
 * Converts a file buffer to a Google Generative AI Part
 * @param fileBuffer The file buffer
 * @param mimeType The MIME type of the file
 * @returns A Part object compatible with Google's Generative AI
 */
export function fileToGenerativePart(fileBuffer: Buffer, mimeType: string): Part {
	return {
		inlineData: {
			data: Buffer.from(fileBuffer).toString("base64"),
			mimeType,
		},
	};
}

/**
 * Checks if a file is supported by the Gemini Vision model
 * @param mimeType The MIME type of the file
 * @returns Boolean indicating if the file is supported
 */
export function isSupportedFileType(mimeType: string): boolean {
	const supportedTypes = [
		// Images
		"image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp",
		// Documents
		"application/pdf",
		// Text
		"text/plain", "text/csv", "application/json",
		// Office documents
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation"
	];

	return supportedTypes.includes(mimeType);
}
