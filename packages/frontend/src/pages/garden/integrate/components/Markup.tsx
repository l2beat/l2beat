import type { ReactNode } from 'react'

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-tertiary px-1.5 py-0.5 font-mono text-paragraph-13">
      {children}
    </code>
  )
}

/** Renders the `backticks` the content uses. */
export function Markup({ text }: { text: string }) {
  return (
    <>
      {text
        .split('`')
        .map((part, index) =>
          index % 2 === 1 ? (
            <Code key={index}>{part}</Code>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
    </>
  )
}
