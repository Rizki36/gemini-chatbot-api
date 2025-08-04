import { useState, useRef, useEffect } from "react";
import "./index.css";
import { ChatMessage } from "./types";

function App() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Scroll to bottom when messages change
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!inputText.trim() && !selectedFile) return;

		// Add user message to chat
		const userMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content: inputText,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			// Create form data for API request
			const formData = new FormData();
			formData.append("text", inputText);

			if (selectedFile) {
				formData.append("file", selectedFile);
			}

			// Send request to API
			const response = await fetch("/api/chat", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to get response");
			}

			// Add assistant message to chat
			const assistantMessage: ChatMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: data.data,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Error sending message:", error);

			// Add error message to chat
			const errorMessage: ChatMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: `Sorry, an error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			// Reset form
			setInputText("");
			setSelectedFile(null);
			setIsLoading(false);
		}
	};

	// Handle file selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedFile(e.target.files[0]);
		}
	};

	// Clear selected file
	const handleClearFile = () => {
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="flex flex-col h-screen bg-base-200 p-4">
			<header className="navbar bg-primary text-primary-content rounded-box mb-4">
				<div className="flex-1">
					<h1 className="btn btn-ghost normal-case text-xl">
						Gemini AI Chatbot
					</h1>
				</div>
			</header>

			<main className="flex-1 overflow-hidden flex flex-col">
				<div className="flex-1 overflow-y-auto px-4 py-2">
					{messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<h2 className="text-2xl font-bold mb-2">
								Welcome to Gemini AI Chatbot!
							</h2>
							<p className="text-lg mb-4">
								Ask a question or upload a document to get started.
							</p>
							<div className="mockup-code w-full max-w-md">
								<pre data-prefix="$">
									<code>How can I help you today?</code>
								</pre>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}
								>
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img
												src={
													message.role === "user"
														? "/user-avatar.svg"
														: "/bot-avatar.svg"
												}
												alt={message.role === "user" ? "User" : "Assistant"}
												className="bg-neutral-content"
											/>
										</div>
									</div>
									<div
										className={`chat-bubble ${
											message.role === "user"
												? "chat-bubble-primary"
												: "chat-bubble-secondary"
										}`}
									>
										<div className="whitespace-pre-wrap">{message.content}</div>
									</div>
									<div className="chat-footer opacity-50">
										{new Date(message.timestamp).toLocaleTimeString()}
									</div>
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>
					)}
				</div>

				<div className="divider my-2"></div>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-2 p-4 bg-base-100 rounded-box"
				>
					{selectedFile && (
						<div className="flex items-center gap-2 p-2 bg-base-200 rounded">
							<span className="flex-1 truncate">{selectedFile.name}</span>
							<span className="text-sm opacity-70">
								({(selectedFile.size / 1024).toFixed(1)} KB)
							</span>
							<button
								type="button"
								onClick={handleClearFile}
								className="btn btn-circle btn-xs btn-error"
							>
								✕
							</button>
						</div>
					)}

					<div className="flex gap-2">
						<input
							type="text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder="Type your message here..."
							className="input input-bordered flex-1"
							disabled={isLoading}
						/>

						<label className="btn btn-secondary">
							{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
								/>
							</svg>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileChange}
								className="hidden"
								accept="image/*,.pdf,.txt,.csv,.json,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
								disabled={isLoading}
							/>
						</label>

						<button
							type="submit"
							className={`btn btn-primary ${isLoading ? "loading" : ""}`}
							disabled={isLoading || (!inputText.trim() && !selectedFile)}
						>
							{isLoading ? "Sending..." : "Send"}
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}

export default App;
