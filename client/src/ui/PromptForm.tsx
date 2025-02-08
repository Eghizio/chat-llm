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
    <form style={css.form} onSubmit={handleSubmit}>
      <input style={css.input} type="text" name="prompt" id="prompt" />

      <button style={css.btn} type="submit">
        Send
      </button>
    </form>
  );
};

const css = {
  form: {
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  input: { padding: "0.5rem", height: "3rem", fontSize: "x-large", flex: "1" },
  btn: {
    cursor: "pointer",
    fontSize: "large",
    fontWeight: "bold",
    padding: "1rem 2rem",
    height: "3rem",
    // backgroundColor: "lightskyblue",
    backgroundColor: "var(--color)",
    border: "none",
    borderRadius: "4px",
  },
} satisfies Record<string, React.CSSProperties>;
