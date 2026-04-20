import { Logo } from '~/components/Logo'

interface FlowsLogoProps {
  centerX: number
  centerY: number
  isSmallScreen: boolean
}

export function FlowsLogo({ centerX, centerY, isSmallScreen }: FlowsLogoProps) {
  const scale = isSmallScreen ? 1.5 : 2
  const logoWidth = 88 * scale
  const logoHeight = 36 * scale

  return (
    <Logo
      animated={false}
      x={centerX - logoWidth / 2}
      y={centerY - logoHeight / 2}
      width={logoWidth}
      height={logoHeight}
      opacity={0.2}
      className="pointer-events-none"
    />
  )
}
