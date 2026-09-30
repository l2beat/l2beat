import type { OpenGraphTags } from './headTags'

export function OpenGraphPreview({ tags }: { tags: OpenGraphTags }) {
  return (
    <div className="flex flex-col gap-3">
      <LinkCard tags={tags} />
      <TagList tags={tags} />
    </div>
  )
}

/** Laid out like the large-image card chat apps and social feeds unfurl. */
function LinkCard({ tags }: { tags: OpenGraphTags }) {
  return (
    <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-lg border border-divider bg-surface-primary">
      {tags.image ? (
        <img
          src={toCurrentOrigin(tags.image)}
          alt="Open Graph preview"
          className="aspect-1200/630 w-full bg-surface-secondary object-cover"
        />
      ) : (
        <div className="flex aspect-1200/630 w-full items-center justify-center bg-surface-secondary text-2xs text-negative">
          No og:image
        </div>
      )}
      <div className="flex flex-col gap-0.5 px-3 py-2">
        <span className="text-3xs text-secondary uppercase tracking-[0.08em]">
          {tags.siteName ?? getHost(tags.url)}
        </span>
        <span className="line-clamp-2 font-semibold text-primary text-xs">
          {tags.title ?? <Missing />}
        </span>
        <span className="line-clamp-2 text-2xs text-secondary">
          {tags.description ?? <Missing />}
        </span>
      </div>
    </div>
  )
}

function TagList({ tags }: { tags: OpenGraphTags }) {
  const rows: [string, string | undefined][] = [
    ['og:title', tags.title],
    ['og:description', tags.description],
    ['og:url', tags.url],
    ['og:site_name', tags.siteName],
    ['og:type', tags.type],
    ['og:image', tags.image],
    ['twitter:card', tags.twitterCard],
  ]
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-2xs leading-5">
      {rows.map(([name, value]) => (
        <div key={name} className="contents">
          <dt className="text-secondary">{name}</dt>
          <dd className="break-all text-primary">{value ?? <Missing />}</dd>
        </div>
      ))}
    </dl>
  )
}

function Missing() {
  return <span className="text-negative">missing</span>
}

/**
 * The tag names the deployment's public origin, which in dev is a fixed
 * localhost port. The server that rendered this page is the one that has the
 * image, so the preview asks it.
 */
function toCurrentOrigin(url: string) {
  try {
    const { pathname, search } = new URL(url)
    return pathname + search
  } catch {
    return url
  }
}

function getHost(url: string | undefined) {
  if (!url) return undefined
  try {
    return new URL(url).host
  } catch {
    return url
  }
}
