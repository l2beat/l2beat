import type { Manifest } from '~/utils/Manifest'
import type { FontInfo } from './fonts'

export function FontStyles({
  fonts,
  manifest,
}: {
  fonts: FontInfo[]
  manifest: Manifest
}) {
  const fontStyles = fonts
    .flatMap((font) =>
      font.src.map((source) => {
        const descriptors = [
          `font-family: '${font.name}';`,
          `font-style: ${source.style ?? 'normal'};`,
          `font-weight: ${source.weight};`,
          'font-display: swap;',
          `src: url('${manifest.getUrl(source.path)}') format('woff2');`,
          source.unicodeRange && `unicode-range: ${source.unicodeRange};`,
        ].filter(Boolean)
        return `\n  @font-face {\n    ${descriptors.join('\n    ')}\n  }`
      }),
    )
    .join('')

  return (
    <>
      {fonts.map((font) =>
        font.src
          .filter((source) => source.preload)
          .map((source) => (
            <link
              key={source.path}
              rel="preload"
              href={manifest.getUrl(source.path)}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          )),
      )}
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
    </>
  )
}
