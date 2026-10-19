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
    .map((font) =>
      font.src
        .map(
          (source) => `
  @font-face {
    font-family: '${font.name}';
    font-style: ${source.style ?? 'normal'};
    font-weight: ${source.weight};
    font-display: swap;
    src: url('${manifest.getUrl(source.path)}') format('woff2');${source.unicodeRange ? `\n    unicode-range: ${source.unicodeRange};` : ''}
  }`,
        )
        .join(''),
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
