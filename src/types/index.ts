/**
 * Response type for chat API
 */
export interface ChatResponse {
	success: boolean;
	data?: string;
	error?: string;
	model?: string;
}

/**
 * Message interface for chat history
 */
export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}
