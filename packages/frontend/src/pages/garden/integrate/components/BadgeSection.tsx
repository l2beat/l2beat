import { useState } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useTimeout } from '~/hooks/useTimeout'
import { CopyIcon } from '~/icons/Copy'
import { DownloadArrowIcon } from '~/icons/DownloadArrow'
import { CustomLinkIcon } from '~/icons/Outlink'
import { SatisfiedIcon } from '~/icons/Satisfied'
import { cn } from '~/utils/cn'
import { SectionHeading } from '../../components/SectionHeading'
import { SproutIcon } from '../../components/SproutIcon'
import type {
  CropsBadgeAsset,
  CropsBadgeKind,
  CropsBadgeStyle,
} from '../badges'
import { BADGE_RULES, CROPS_API_DOCS_URL } from '../content'
import { Markup } from './Markup'

const KINDS: {
  kind: CropsBadgeKind
  label: string
  hint: string
  /** Preview box height. */
  frame: string
  /** Rendered width in px, in the preview and in the copied markup. */
  width: number
}[] = [
  {
    kind: 'badge',
    label: 'Badge',
    hint: 'About pages, footers, docs',
    frame: 'h-[160px] sm:h-[220px]',
    width: 180,
  },
  {
    kind: 'tag',
    label: 'Tag',
    hint: 'Headers, app UIs, next to a connect button',
    frame: 'h-[88px] sm:h-[120px]',
    width: 220,
  },
  {
    kind: 'icon',
    label: 'Icon',
    hint: 'Wallets and lists - works down to 20px',
    frame: 'h-[120px]',
    width: 56,
  },
]

const STYLES: {
  style: CropsBadgeStyle
  label: string
  /** For the narrow tiles of a phone, where the full label is cut. */
  shortLabel?: string
  dark: boolean
}[] = [
  { style: 'light', label: 'Light', dark: false },
  { style: 'dark', label: 'Dark', dark: true },
  {
    style: 'mono-black',
    label: 'Mono black',
    shortLabel: 'Black',
    dark: false,
  },
  {
    style: 'mono-white',
    label: 'Mono white',
    shortLabel: 'White',
    dark: true,
  },
]

const LINK_TITLE = 'Reviewed under the CROPS framework by L2BEAT'

export function BadgeSection({
  badges,
  href,
}: {
  badges: CropsBadgeAsset[]
  href: string
}) {
  return (
    <section className="mt-6 md:mt-8">
      <SectionHeading
        title="Wear the badge"
        size="md"
        description="If your project is in the attested set, the badge is yours to use. Download the SVG, or copy it as markup that links to the garden."
      />
      <PrimaryCard className="max-md:mx-4 max-md:rounded-xl md:p-8">
        <div className="flex flex-col divide-y divide-divider">
          {KINDS.map((kind) => (
            <div key={kind.kind} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-bold text-heading-16 md:text-heading-18">
                  {kind.label}
                </h3>
                <p className="text-paragraph-14 text-secondary">{kind.hint}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {STYLES.map((style) => {
                  const asset = badges.find(
                    (b) => b.kind === kind.kind && b.style === style.style,
                  )
                  return asset ? (
                    <BadgeTile
                      key={style.style}
                      asset={asset}
                      label={style.label}
                      shortLabel={style.shortLabel}
                      dark={style.dark}
                      frame={kind.frame}
                      width={kind.width}
                      href={href}
                    />
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-divider border-t pt-6">
          <h3 className="font-bold text-heading-16 md:text-heading-18">
            Using it fairly
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {BADGE_RULES.map((rule) => (
              <li
                key={rule}
                className="flex gap-2.5 text-pretty text-paragraph-14 text-secondary md:text-paragraph-16"
              >
                <SproutIcon className="mt-1 size-4 shrink-0 text-garden-accent" />
                <span>
                  <Markup text={rule} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-paragraph-14 md:text-paragraph-16">
            <a
              href={CROPS_API_DOCS_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-link"
            >
              Check your status in the API docs
              <CustomLinkIcon className="ml-1 inline-block fill-current align-baseline" />
            </a>
          </p>
        </div>
      </PrimaryCard>
    </section>
  )
}

function BadgeTile({
  asset,
  label,
  shortLabel,
  dark,
  frame,
  width,
  href,
}: {
  asset: CropsBadgeAsset
  label: string
  shortLabel?: string
  dark: boolean
  frame: string
  width: number
  href: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-divider">
      <div
        className={cn(
          'flex items-center justify-center p-4',
          frame,
          dark ? 'bg-[#0d0e10]' : 'bg-[#f3f5f7]',
        )}
      >
        <img
          src={asset.url}
          alt={`CROPS ${asset.kind}, ${label.toLowerCase()}`}
          className="h-auto max-w-full"
          style={{ width }}
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-divider border-t bg-surface-secondary py-1.5 pr-1.5 pl-2.5 lg:pl-3">
        <span className="truncate font-semibold text-secondary text-subtitle-12 uppercase tracking-wide lg:tracking-wider">
          <span className={cn(shortLabel && 'max-sm:hidden')}>{label}</span>
          {shortLabel && <span className="sm:hidden">{shortLabel}</span>}
        </span>
        <div className="flex shrink-0 items-center gap-0.5 lg:gap-0">
          <a
            href={asset.url}
            download={asset.fileName}
            title="Download SVG"
            aria-label={`Download ${asset.fileName}`}
            className="rounded-md p-1 hover:bg-surface-tertiary lg:p-1.5"
          >
            <DownloadArrowIcon className="size-4 fill-current" />
          </a>
          <CopyMarkupButton url={asset.url} width={width} href={href} />
        </div>
      </div>
    </div>
  )
}

/** Copies the SVG inline, wrapped in a link to the garden, so it needs nothing from our domain. */
function CopyMarkupButton({
  url,
  width,
  href,
}: {
  url: string
  width: number
  href: string
}) {
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1400 : null)

  async function onClick() {
    const blob = fetch(url).then(async (res) => {
      if (!res.ok) {
        throw new Error('Badge SVG fetch failed', {
          cause: { url, status: res.status },
        })
      }
      const svg = resizeSvg(await res.text(), width)
      const markup = `<a href="${href}" title="${LINK_TITLE}">\n${svg}\n</a>`
      return new Blob([markup], { type: 'text/plain' })
    })
    try {
      // The write starts inside the click and takes the pending fetch, so
      // Safari does not drop the user gesture while the SVG loads.
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': blob }),
      ])
      setCopied(true)
    } catch (error) {
      console.warn('Badge markup copy failed', error)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      title="Copy SVG markup"
      aria-label="Copy SVG markup"
      className="rounded-md p-1 hover:bg-surface-tertiary lg:p-1.5"
    >
      {copied ? (
        <SatisfiedIcon className="size-4 fill-green-700 dark:fill-green-450" />
      ) : (
        <CopyIcon className="size-4 fill-current" />
      )}
    </button>
  )
}

/** Sets the root `<svg>` to `width`, keeping its aspect ratio, as exports carry their Figma frame size. */
function resizeSvg(svg: string, width: number) {
  return svg
    .trim()
    .replace(
      /^<svg([^>]*?) width="([\d.]+)" height="([\d.]+)"/,
      (_, attrs: string, w: string, h: string) =>
        `<svg${attrs} width="${width}" height="${Math.round((width * Number(h)) / Number(w))}"`,
    )
}
