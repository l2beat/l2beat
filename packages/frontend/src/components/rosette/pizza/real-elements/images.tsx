import Image from 'next/image'
import { cn } from '~/utils/cn'
import type { RosetteValue } from '../../types'

export function risksToImagePizzas(
  risks: RosetteValue[],
  selectedRisk?: RosetteValue,
  containerSize = 272 + 5,
) {
  const radiusScalingFactor = 6.29
  const widthScalingFactor = 3.09
  const heightScalingFactor = 3.76
  const containerCenter = containerSize / 2
  const imageRadius = containerSize / radiusScalingFactor
  const width = containerSize / widthScalingFactor
  const height = containerSize / heightScalingFactor

  const [sfRisk, svRisk, daRisk, ewRisk, pfRisk] = risks as [
    RosetteValue,
    RosetteValue,
    RosetteValue,
    RosetteValue,
    RosetteValue,
  ]

  const sf = riskToImage(sfRisk)
  const sv = riskToImage(svRisk)
  const da = riskToImage(daRisk)
  const ew = riskToImage(ewRisk)
  const pf = riskToImage(pfRisk)

  return (
    <>
      {sf && (
        <Image
          src={sf}
          alt={sfRisk.name}
          width={width}
          height={height}
          style={{
            top: containerCenter - Math.cos((-4 * Math.PI) / 5) * imageRadius,
            left: containerCenter + Math.sin((-4 * Math.PI) / 5) * imageRadius,
          }}
          className={cn(
            'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rotate-[216deg]',
            selectedRisk && selectedRisk.name !== sfRisk.name && 'opacity-20',
          )}
        />
      )}

      {sv && (
        <Image
          src={sv}
          alt={svRisk.name}
          width={width}
          height={height}
          style={{
            top: containerCenter - Math.cos((-2 * Math.PI) / 5) * imageRadius,
            left: containerCenter + Math.sin((-2 * Math.PI) / 5) * imageRadius,
          }}
          className={cn(
            'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rotate-[-72deg]',
            selectedRisk && selectedRisk.name !== svRisk.name && 'opacity-20',
          )}
        />
      )}

      {da && (
        <Image
          src={da}
          alt={daRisk.name}
          width={width}
          height={height}
          style={{
            top: containerCenter - Math.cos(0) * imageRadius, // Top center
            left: containerCenter + Math.sin(0) * imageRadius,
          }}
          className={cn(
            'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2',
            selectedRisk && selectedRisk.name !== daRisk.name && 'opacity-20',
          )}
        />
      )}

      {ew && (
        <Image
          src={ew}
          alt={ewRisk.name}
          width={width}
          height={height}
          style={{
            top: containerCenter - Math.cos((2 * Math.PI) / 5) * imageRadius,
            left: containerCenter + Math.sin((2 * Math.PI) / 5) * imageRadius,
          }}
          className={cn(
            'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rotate-[72deg]',
            selectedRisk && selectedRisk.name !== ewRisk.name && 'opacity-20',
          )}
        />
      )}

      {pf && (
        <Image
          src={pf}
          alt={pfRisk.name}
          width={width}
          height={height}
          style={{
            top: containerCenter - Math.cos((4 * Math.PI) / 5) * imageRadius,
            left: containerCenter + Math.sin((4 * Math.PI) / 5) * imageRadius,
          }}
          className={cn(
            'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rotate-[-216deg]',
            selectedRisk && selectedRisk.name !== pfRisk.name && 'opacity-20',
          )}
        />
      )}
    </>
  )
}

function riskToImage(risk: RosetteValue) {
  if (risk.sentiment === 'good') return '/images/green.png'
  if (risk.sentiment === 'warning') return '/images/yellow.png'
  if (risk.sentiment === 'bad') return '/images/red.png'
}
