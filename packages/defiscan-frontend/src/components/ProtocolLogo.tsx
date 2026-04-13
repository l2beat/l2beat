import { useEffect, useState } from 'react'

const DEFAULT_LOGO = '/defiscan-mark-blue.svg'

type Stage = 'svg' | 'png' | 'fallback'

interface ProtocolLogoProps {
  slug: string
  alt?: string
  className?: string
}

/**
 * Renders a protocol logo from /public/protocols/<slug>.{svg,png}, with a
 * graceful fallback chain: svg → png → defiscan mark. Logos are dropped into
 * that folder by the /gather-resources skill (see its Step 1.5).
 */
export function ProtocolLogo({ slug, alt = '', className }: ProtocolLogoProps) {
  const [stage, setStage] = useState<Stage>('svg')

  // Reset the chain when the slug changes (e.g. carousel navigation).
  useEffect(() => {
    setStage('svg')
  }, [slug])

  const src =
    stage === 'svg'
      ? `/protocols/${slug}.svg`
      : stage === 'png'
        ? `/protocols/${slug}.png`
        : DEFAULT_LOGO

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (stage === 'svg') setStage('png')
        else if (stage === 'png') setStage('fallback')
      }}
    />
  )
}