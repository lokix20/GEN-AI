import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../lib/utils";

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("space-y-3 text-sm leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-lg font-semibold" {...props} />,
          h2: (props) => <h2 className="text-base font-semibold" {...props} />,
          h3: (props) => <h3 className="text-sm font-semibold" {...props} />,
          p: (props) => <p className="leading-relaxed" {...props} />,
          ul: (props) => <ul className="list-disc space-y-1 pl-5" {...props} />,
          ol: (props) => <ol className="list-decimal space-y-1 pl-5" {...props} />,
          a: (props) => <a className="text-forest underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />,
          code: ({ className: codeClassName, children, ...props }) => (
            <code className={cn("rounded bg-muted px-1.5 py-0.5 text-xs", codeClassName)} {...props}>
              {children}
            </code>
          ),
          pre: (props) => <pre className="overflow-x-auto rounded-2xl bg-muted p-3 text-xs" {...props} />,
          table: (props) => (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs" {...props} />
            </div>
          ),
          th: (props) => <th className="border-b border-border bg-muted px-3 py-2 font-semibold" {...props} />,
          td: (props) => <td className="border-b border-border/50 px-3 py-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
