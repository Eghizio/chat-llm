interface Props {
  onSubmit: (prompt: string) => Promise<void> | void;
}

export const PromptForm = ({ onSubmit }: Props) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    // @ts-ignore
    const prompt: string = form.elements["prompt"].value;
    form.reset();

    await onSubmit(prompt);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="prompt" id="prompt" />
      <button type="submit">Send</button>
    </form>
  );
};
