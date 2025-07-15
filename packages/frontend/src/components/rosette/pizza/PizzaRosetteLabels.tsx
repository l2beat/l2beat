import { assert } from '@l2beat/shared-pure'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { cn } from '~/utils/cn'
import { useRosetteTooltipContext } from '../RosetteTooltipContext'
import type { RosetteValue } from '../types'

interface Props extends VariantProps<typeof rosetteVariants> {
  values: RosetteValue[]
  containerSize: number
  textRadius: number
  textClassName?: string
}

const rosetteVariants = cva(
  'select-none whitespace-pre text-center uppercase',
  {
    variants: {
      size: {
        small: 'text-subtitle-10',
        regular: 'text-subtitle-14',
      },
    },
    defaultVariants: {
      size: 'regular',
    },
  },
)

export function PizzaRosetteLabels({
  values,
  containerSize,
  textRadius,
  size,
  textClassName,
}: Props) {
  const context = useRosetteTooltipContext()

  const [first, second, third, fourth, fifth] = values
  const selectedRisk = context?.selectedRisk

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const containerCenter = containerSize / 2

  return (
    <>
      <span
        style={{
          top: containerCenter - Math.cos((-4 * Math.PI) / 5) * textRadius,
          left: containerCenter + Math.sin((-4 * Math.PI) / 5) * textRadius,
        }}
        className={cn(
          '-translate-x-1/2 absolute origin-top rotate-36',
          rosetteVariants({ size, className: textClassName }),
          selectedRisk && selectedRisk.name !== first.name && 'opacity-20',
        )}
      >
        {first.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter - Math.cos((-2 * Math.PI) / 5) * textRadius,
          left: containerCenter + Math.sin((-2 * Math.PI) / 5) * textRadius,
        }}
        className={cn(
          '-translate-x-1/2 -translate-y-full absolute origin-bottom rotate-[-72deg]',
          rosetteVariants({ size, className: textClassName }),
          selectedRisk && selectedRisk.name !== second.name && 'opacity-20',
        )}
      >
        {second.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter - textRadius,
          left: '50%',
        }}
        className={cn(
          '-translate-x-1/2 -translate-y-full absolute',
          rosetteVariants({ size, className: textClassName }),
          selectedRisk && selectedRisk.name !== third.name && 'opacity-20',
        )}
      >
        {third.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter - Math.cos((2 * Math.PI) / 5) * textRadius,
          left: containerCenter + Math.sin((2 * Math.PI) / 5) * textRadius,
        }}
        className={cn(
          '-translate-x-1/2 -translate-y-full absolute origin-bottom rotate-72',
          rosetteVariants({ size, className: textClassName }),
          selectedRisk && selectedRisk.name !== fourth.name && 'opacity-20',
        )}
      >
        {fourth.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: containerCenter - Math.cos((4 * Math.PI) / 5) * textRadius,
          left: containerCenter + Math.sin((4 * Math.PI) / 5) * textRadius,
        }}
        className={cn(
          '-translate-x-1/2 absolute origin-top rotate-[-36deg]',
          rosetteVariants({ size, className: textClassName }),
          selectedRisk && selectedRisk.name !== fifth.name && 'opacity-20',
        )}
      >
        {fifth.name.split(' ').join('\n')}
      </span>
    </>
  )
}
