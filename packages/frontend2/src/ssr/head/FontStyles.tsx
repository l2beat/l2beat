import React from 'react'
import type { FontInfo } from './fonts'
import type { Manifest } from '../../common/Manifest'

export function FontStyles({
  fonts,
  manifest,
}: { fonts: FontInfo[]; manifest: Manifest }) {
  const fontStyles = fonts
    .map((font) =>
      font.src
        .map(
          (source) => `
  @font-face {
    font-family: '${font.name}';
    font-style: normal;
    font-weight: ${source.weight};
    font-display: swap;
    src: url('${manifest.getUrl(source.path)}') format('woff2');
  }`,
        )
        .join(''),
    )
    .join('')

  return <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
}
