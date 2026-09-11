import type { ReactNode } from 'react'
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
            'flex items-center justify-between gap-3 px-3 py-2',
            hasBody && 'border-divider border-b',
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
        <pre
          className={cn(
            'max-h-[30rem] overflow-auto p-4 font-mono text-paragraph-12 leading-relaxed md:text-paragraph-13',
            wrap && 'whitespace-pre-wrap break-all',
          )}
        >
          <code>{children}</code>
        </pre>
      )}
    </div>
  )
}

export function RequestHeader({ url }: { url: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="shrink-0 rounded bg-[#e8f0e2] px-1.5 py-0.5 font-bold text-[#3f6d2c] text-[11px] uppercase tracking-wider dark:bg-[#15ca60]/15 dark:text-[#8fd06a]">
        get
      </span>
      <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-paragraph-13">
        {url}
      </code>
    </span>
  )
}
