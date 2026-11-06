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
  /** "between_tools" turns thinking off on this model ("disabled" is rejected with a 400). */
  thinking?: "between_tools" | "default";
};

function getKey(): string {
  const key = process.env.CLAUDE_API_KEY;
  if (!key) {
    throw new Error("CLAUDE_API_KEY is not set. Add it to .env (see .env.example).");
  }
  return key;
}

/** Server-side only. Returns the text of the reply. Not called anywhere yet. */
export async function askClaude({ system, messages, timeoutMs = 20000, maxTokens = 1024, thinking = "between_tools" }: AskClaudeInput): Promise<string> {
  const client = new Anthropic({ apiKey: getKey(), timeout: timeoutMs, maxRetries: 0 });
  const res = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages,
    // This model thinks by default; thinking tokens ate the budget and the latency (T-007).
    // "between_tools" is how it turns thinking off. Not in the SDK types yet.
    ...(thinking === "between_tools" ? ({ thinking: { type: "between_tools" } } as object) : {}),
  });
  return res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
}
