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
          background === 'dark' ? 'bg-black' : 'bg-white',
        )}
      >
        {children}
      </div>
      <div className="flex items-center gap-1">
        <span className="mr-1 text-secondary text-xs">
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
      className="flex items-center gap-1.5 font-medium text-primary text-xs underline decoration-dotted underline-offset-2 hover:text-brand"
    >
      {children}
    </a>
  )
}
