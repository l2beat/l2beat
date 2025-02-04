import { assert } from '@l2beat/shared-pure'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { cn } from '~/utils/cn'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import type { RosetteValue } from '../types'

interface Props extends VariantProps<typeof rosetteVariants> {
  values: RosetteValue[]
  containerSize: number
  textRadius: number
}

const rosetteVariants = cva(
  'select-none whitespace-pre text-center font-medium uppercase leading-tight',
  {
    variants: {
      size: {
        small: 'text-3xs',
        regular: 'text-xs',
      },
    },
    defaultVariants: {
      size: 'regular',
    },
  },
)

export function PentagonRosetteLabels({
  values,
  containerSize,
  textRadius,
  size,
}: Props) {
  const context = useRosetteTooltipContext()
  const selectedRisk = context?.selectedRisk
  const [first, second, third, fourth, fifth] = values
  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const containerCenter = containerSize / 2

  return (
    <>
      <span
        style={{
          top: containerCenter - Math.cos(Math.PI / 5) * textRadius,
          left: containerCenter + Math.sin(Math.PI / 5) * textRadius,
        }}
        className={cn(
          'absolute origin-bottom -translate-x-1/2 -translate-y-full rotate-[36deg]',
          rosetteVariants({ size }),
          selectedRisk && selectedRisk.name !== first.name && 'opacity-20',
        )}
      >
        {first.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter - Math.cos((3 * Math.PI) / 5) * textRadius,
          left: containerCenter + Math.sin((3 * Math.PI) / 5) * textRadius,
        }}
        className={cn(
          'absolute origin-top -translate-x-1/2 rotate-[-72deg]',
          rosetteVariants({ size }),
          selectedRisk && selectedRisk.name !== second.name && 'opacity-20',
        )}
      >
        {second.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter + textRadius,
          left: '50%',
        }}
        className={cn(
          'absolute -translate-x-1/2',
          rosetteVariants({ size }),
          selectedRisk && selectedRisk.name !== third.name && 'opacity-20',
        )}
      >
        {third.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter - Math.cos((-3 * Math.PI) / 5) * textRadius,
          left: containerCenter + Math.sin((-3 * Math.PI) / 5) * textRadius,
        }}
        className={cn(
          'absolute origin-top -translate-x-1/2 rotate-[72deg]',
          rosetteVariants({ size }),
          selectedRisk && selectedRisk.name !== fourth.name && 'opacity-20',
        )}
      >
        {fourth.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter - Math.cos((-1 * Math.PI) / 5) * textRadius,
          left: containerCenter + Math.sin((-1 * Math.PI) / 5) * textRadius,
        }}
        className={cn(
          'absolute origin-bottom -translate-x-1/2 -translate-y-full rotate-[-36deg]',
          rosetteVariants({ size }),
          selectedRisk && selectedRisk.name !== fifth.name && 'opacity-20',
        )}
      >
        {fifth.name.split(' ').join('\n')}
      </span>
    </>
  )
}
