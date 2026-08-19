import { CopyButton } from '~/components/CopyButton'
import { cn } from '~/utils/cn'
import { type CodeLanguage, type TokenKind, tokenize } from './codeHighlight'

const TOKEN_CLASS: Record<TokenKind, string> = {
  key: 'text-[#0d5aa7] dark:text-[#7cc4ff]',
  string: 'text-[#16863f] dark:text-[#3fe07f]',
  number: 'text-[#b06a00] dark:text-[#ffb454]',
  keyword: 'text-[#7e41cc] dark:text-[#db8bf7]',
  tag: 'text-[#b3266b] dark:text-[#ff7ab2]',
  attr: 'text-[#7e41cc] dark:text-[#db8bf7]',
  punct: 'text-[#8b9099] dark:text-[#6b7079]',
  elision: 'text-[#a6abb3] dark:text-[#5a5f68]',
  plain: '',
}

interface Props {
  language: CodeLanguage
  code: string
  /** Small label in the header strip. Omit for a headerless block. */
  label?: string
  /** Anything to sit in the header instead of a label - a request line, say. */
  header?: React.ReactNode
  /** Text the copy button hands over. No button when absent. */
  copy?: string
  copyText?: string
  /** For one long line, like the schema, where indentation carries nothing. */
  wrap?: boolean
  className?: string
}

/**
 * One bordered block for every piece of code on this page, so a request, a
 * response and the badge markup all read as the same kind of object. The header
 * strip is where the label and the copy button live - floating the button over
 * the code puts it on top of the first line, which is the line most worth
 * reading.
 */
export function CodeSnippet({
  language,
  code,
  label,
  header,
  copy,
  copyText = 'Copy',
  wrap,
  className,
}: Props) {
  const tokens = tokenize(code, language)
  const hasHeader = header !== undefined || label !== undefined
  // A header-only block - a request line with nothing under it - must not draw
  // an empty `pre`, which reads as a rendering bug rather than as intent.
  const hasBody = code.length > 0

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
            'p-4 font-mono text-paragraph-12 leading-relaxed md:text-paragraph-13',
            wrap ? 'whitespace-pre-wrap break-all' : 'overflow-x-auto',
          )}
        >
          <code>
            {tokens.map((token, index) => (
              <span
                // Tokens are positional and the list is regenerated wholesale
                // on every change, so the index is the identity.
                key={index}
                className={TOKEN_CLASS[token.kind]}
              >
                {token.text}
              </span>
            ))}
          </code>
        </pre>
      )}
    </div>
  )
}

/** The request line, for the header slot of an endpoint's snippet. */
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
