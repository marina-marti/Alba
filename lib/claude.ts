import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Change the model here only.
export const CLAUDE_MODEL = "claude-sonnet-5-5";

export type ClaudeMessage = { role: "user" | "assistant"; content: string };

export type AskClaudeInput = {
  system: string;
  messages: ClaudeMessage[];
  timeoutMs?: number;
  maxTokens?: number;
};

function getKey(): string {
  const key = process.env.CLAUDE_API_KEY;
  if (!key) {
    throw new Error("CLAUDE_API_KEY is not set. Add it to .env (see .env.example).");
  }
  return key;
}

/** Server-side only. Returns the text of the reply. Not called anywhere yet. */
export async function askClaude({ system, messages, timeoutMs = 20000, maxTokens = 1024 }: AskClaudeInput): Promise<string> {
  const client = new Anthropic({ apiKey: getKey(), timeout: timeoutMs, maxRetries: 0 });
  const res = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages,
  });
  return res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
}
