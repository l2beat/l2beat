import { cn } from '~/utils/cn'

export function LogoPreviewCard({
  background,
  children,
  svgHref,
  pngHref,
}: {
  background: 'dark' | 'light'
  children: React.ReactNode
  svgHref: string
  pngHref: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-divider p-8',
          background === 'dark' ? 'bg-[#0D0C0C]' : 'bg-pure-white',
        )}
      >
        {children}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium text-label-value-13 text-primary">
          {background === 'dark' ? 'Light' : 'Dark'}
        </span>
        <DownloadButton href={svgHref}>SVG</DownloadButton>
        <DownloadButton href={pngHref}>PNG</DownloadButton>
      </div>
    </div>
  )
}

function DownloadButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      download
      className="flex items-center gap-1.5 text-label-value-13 text-primary underline decoration-divider underline-offset-[0.3em] transition-colors hover:text-brand-deep hover:decoration-current"
    >
      {children}
    </a>
  )
}
