import { Author } from "../lib/model";
import { MarkdownSyntax } from "./MarkdownSyntax";

interface Props {
  author: Author;
  text: string;
}

export const MessageBubble = ({ author, text }: Props) => {
  const colors = author === Author.User ? css.user : css.agent;
  const side = author === Author.User ? css.right : css.left;

  return (
    <article style={css.bubble}>
      <div style={{ ...css.msg, ...colors }}>
        <span style={css.author}>{author}:</span>
        <MarkdownSyntax>{text}</MarkdownSyntax>
      </div>
      <div style={{ ...css.tail, ...colors, ...side }} />
    </article>
  );
};

const css = {
  msg: { padding: "1rem", borderRadius: "8px" },
  author: { fontWeight: "bold", textDecoration: "underline" },
  user: { color: "white", backgroundColor: "dodgerblue" },
  agent: { color: "white", backgroundColor: "purple" },
  bubble: { position: "relative", paddingBottom: "1rem" },
  tail: { position: "absolute", borderTop: "1rem solid transparent" },
  left: { left: "1rem", borderRight: "1rem solid" },
  right: { right: "1rem", borderLeft: "1rem solid" },
} satisfies Record<string, React.CSSProperties>;
