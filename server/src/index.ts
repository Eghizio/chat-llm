import { createOllama } from "ollama-ai-provider";
import { type Message, streamText } from "ai";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk, { type ColorName } from "chalk";

// const MODEL_NAME = "llama3.2";
// const MODEL_NAME = "tinyllama";
const MODEL_NAME = "phi4";

const model = createOllama()(MODEL_NAME);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const createLogger =
  (color: ColorName, name: string = "server") =>
  (text: string) =>
    console.log(chalk[color](`[${name}] ${text}`));

const Log = {
  server: createLogger("green", "server"),
  error: createLogger("red", "error"),
  user: createLogger("magenta", "user"),
  agent: createLogger("cyan", MODEL_NAME),
  // agent: createLogger("cyan", "agent"),
};

class MessageHistory {
  private _messages: Message[] = [];

  get messages(): Message[] {
    return this._messages;
  }

  addAssistantMessage(content: string) {
    this.addMessage(content, "assistant");
  }

  addUserMessage(content: string) {
    this.addMessage(content, "user");
  }

  private addMessage(content: string, role: Message["role"]) {
    this._messages.push({ id: crypto.randomUUID(), role, content });
  }
}

const history = new MessageHistory();

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/api/v1/chat", async (req, res) => {
  const prompt = req.query?.prompt?.toString();

  if (!prompt) {
    const error = "Empty prompt query.";
    res.status(400).json({ error });
    Log.error(error);
    return;
  }

  try {
    Log.user(prompt);
    history.addUserMessage(prompt);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    Log.agent(`Thinking...\n`);

    const result = streamText({ model, messages: history.messages });

    for await (const chunk of result.textStream) {
      res.write(chunk);
    }

    const text = await result.text;
    Log.agent(text);
    history.addAssistantMessage(text);

    res.end();
    return;
  } catch (error) {
    Log.error(error);
    res.status(500).json({ error: "An error occurred." });
    return;
  }
});

app.listen(PORT, () => {
  Log.server(new Date().toISOString());
  Log.server(`Server running on port ${PORT}`);
  Log.server(`http://localhost:${PORT}`);
});
