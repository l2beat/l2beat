import { Fragment, type ReactNode } from 'react'
import { CopyButton } from '~/components/CopyButton'
import { cn } from '~/utils/cn'

interface Props {
  /** The body. Omit for a snippet that is only a header, like a request line. */
  children?: ReactNode
  label?: string
  /** Replaces the label. */
  header?: ReactNode
  /** No copy button when absent. */
  copy?: string
  copyText?: string
  wrap?: boolean
  className?: string
}

export function CodeSnippet({
  children,
  label,
  header,
  copy,
  copyText = 'Copy',
  wrap,
  className,
}: Props) {
  const hasHeader = header !== undefined || label !== undefined
  const hasBody = children !== undefined

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-divider bg-surface-secondary',
        className,
      )}
    >
      {hasHeader && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 px-4 py-2',
            hasBody && 'border-divider border-b',
            // A request URL wraps on phone; keep the copy button on its first line.
            header && 'max-md:items-start',
          )}
        >
          {header ?? (
            <span className="font-semibold text-secondary text-subtitle-12 uppercase tracking-wider">
              {label}
            </span>
          )}
          {copy !== undefined && (
            <CopyButton
              toCopy={copy}
              copyText={copyText}
              className="shrink-0 rounded-md p-1.5 hover:bg-surface-tertiary"
              iconClassName="size-4"
            />
          )}
        </div>
      )}
      {hasBody && (
        // The height cuts a line in half, so a long body reads as scrollable.
        <pre
          className={cn(
            'max-h-[30.75rem] overflow-auto p-4 font-mono text-paragraph-13 leading-relaxed',
            wrap && 'whitespace-pre-wrap break-words',
          )}
        >
          <code>{children}</code>
        </pre>
      )}
    </div>
  )
}

export function RequestHeader({ url }: { url: string }) {
  // On phone the URL wraps after a slash, so the path stays in view rather than behind a scroll.
  const segments = url.split('/')
  return (
    <span className="flex min-w-0 items-center gap-2.5 max-md:items-start">
      <span className="shrink-0 rounded bg-garden-accent/15 px-1.5 py-0.5 font-bold text-[11px] text-garden-accent uppercase tracking-wider">
        get
      </span>
      <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-paragraph-13 max-md:whitespace-normal max-md:break-words">
        {segments.map((segment, index) => (
          // Positional: the index is the identity of a path segment.
          <Fragment key={index}>
            {segment}
            {index < segments.length - 1 && (
              <>
                /<wbr />
              </>
            )}
          </Fragment>
        ))}
      </code>
    </span>
  )
}
