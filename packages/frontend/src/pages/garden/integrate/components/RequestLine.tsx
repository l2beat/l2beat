import { CopyButton } from '~/components/CopyButton'

/**
 * The request on its own line, as a consumer would paste it into curl or an
 * address bar. The method sits outside the copyable text on purpose - what is
 * worth copying is the url, not the word GET in front of it.
 */
export function RequestLine({ url }: { url: string }) {
  return (
    <div className="mt-4 flex items-stretch gap-px overflow-hidden rounded-lg bg-surface-tertiary">
      <span className="flex shrink-0 items-center bg-black/[.04] px-3 font-semibold text-subtitle-12 uppercase tracking-wider dark:bg-white/[.06]">
        get
      </span>
      <code className="min-w-0 grow overflow-x-auto whitespace-nowrap px-3 py-2.5 font-mono text-paragraph-13 leading-relaxed">
        {url}
      </code>
      <span className="flex shrink-0 items-center pr-2.5 pl-1.5">
        <CopyButton
          toCopy={url}
          copyText="Copy URL"
          className="rounded p-1"
          iconClassName="size-4"
        />
      </span>
    </div>
  )
}
