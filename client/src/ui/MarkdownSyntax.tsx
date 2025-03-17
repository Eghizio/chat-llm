import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 as style } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Props {
  children: string;
}

export const MarkdownSyntax = ({ children }: Props) => (
  <Markdown
    remarkPlugins={[remarkGfm]}
    components={{
      code(props) {
        const { children, className, node, ref, ...rest } = props;
        const match = /language-(\w+)/.exec(className || "");

        if (!match) {
          return (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        }

        return (
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, "")}
            language={match[1]}
            style={style}
          />
        );
      },
    }}
  >
    {children}
  </Markdown>
);
