import { useState } from "react";
import { PromptForm } from "./PromptForm";
import { streamCompletion } from "./api";

enum Author {
  User = "User",
  Agent = "Agent",
}

type Message = { author: Author; text: string };

export const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChunk = (chunk: string) => {
    // console.log(chunk);
    setCompletion((p) => p + chunk);
  };

  console.log({ completion });

  const handleSubmit = async (prompt: string) => {
    try {
      setIsLoading(true);
      setMessages((p) => [...p, { author: Author.User, text: prompt }]);

      let completionWithoutGodDamnClosure = "";
      //   await streamCompletion(prompt, onChunk);
      await streamCompletion(prompt, (chunk: string) => {
        completionWithoutGodDamnClosure += chunk;
        setCompletion((p) => p + chunk);
      });

      console.log("Setting agent message");
      setMessages((p) => [
        ...p,
        { author: Author.Agent, text: completionWithoutGodDamnClosure },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Clearing completion");
      setCompletion("");
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h1>Chat</h1>

      <PromptForm onSubmit={handleSubmit} />

      {messages.map(({ author, text }, index) => (
        <div key={index}>
          <strong>{author}:</strong>
          <pre>{text}</pre>
        </div>
      ))}

      {completion ? (
        <div>
          <strong>{Author.Agent}:</strong>
          <pre>{completion}</pre>
        </div>
      ) : isLoading ? (
        <p>Thinking...</p>
      ) : null}
    </main>
  );
};
