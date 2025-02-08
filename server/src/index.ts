import { createOllama } from "ollama-ai-provider";
import { streamText } from "ai";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk, { ColorName } from "chalk";

const MODEL_NAME = "llama3.2";
// const MODEL_NAME = "tinyllama";

const model = createOllama()(MODEL_NAME);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const createLogger =
  (color: ColorName, name: string = "server") =>
  (text: string) =>
    console.log(chalk[color](`[${name}] ${text}`));

const Log = {
  server: createLogger("green", "server"),
  error: createLogger("red", "error"),
  agent: createLogger("cyan", MODEL_NAME),
  // agent: createLogger("cyan", "agent"),
};

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
    Log.agent(`Processing: "${prompt}"...`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    Log.agent(`Thinking...\n`);

    const result = streamText({ model, prompt });

    for await (const chunk of result.textStream) {
      res.write(chunk);
    }

    Log.agent(await result.text);

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
