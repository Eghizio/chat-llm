import { useState } from "react";
import { PromptForm } from "./ui/PromptForm";
import { MessageBubble } from "./ui/MessageBubble";
import { streamCompletion } from "./lib/api";
import { Author, type Message } from "./lib/model";

export const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChunk = (chunk: string) => {
    setCompletion((p) => p + chunk);
  };

  const handleSubmit = async (prompt: string) => {
    try {
      setMessages((p) => [...p, { author: Author.User, text: prompt }]);
      setIsLoading(true);

      const text = await streamCompletion(prompt, onChunk);

      setMessages((p) => [...p, { author: Author.Agent, text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setCompletion("");
      setIsLoading(false);
    }
  };

  return (
    <main style={css.app}>
      <header style={css.header}>
        <h1 style={{ margin: 0, fontSize: "x-large" }}>LLM Stream Chat</h1>
      </header>

      <section style={css.chat}>
        <PromptForm onSubmit={handleSubmit} />

        <div style={css.messages}>
          {completion ? (
            <MessageBubble author={Author.Agent} text={completion} />
          ) : isLoading ? (
            <p>Thinking...</p>
          ) : null}

          {messages.toReversed().map(({ author, text }, index) => (
            <MessageBubble key={index} author={author} text={text} />
          ))}
        </div>
      </section>
    </main>
  );
};

const css = {
  app: { width: "100vw", height: "100vh" },
  header: {
    padding: "0.5rem",
    height: "5%",
    // backgroundColor: "lightskyblue",
    backgroundColor: "var(--color)",
    display: "flex",
    alignItems: "center",
  },
  chat: {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    gap: "0.5rem",
    height: "95%",
  },
  messages: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column-reverse",
    gap: "1rem",
    overflowY: "scroll",
    height: "90%",
  },
} satisfies Record<string, React.CSSProperties>;
