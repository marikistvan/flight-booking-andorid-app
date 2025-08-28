export interface MessageHistory {
    role: "user" | "assistant" | "system",
    content: string,
    timestamp: Date
}