import { assert } from '@l2beat/shared-pure'
import { type RosetteValue } from '../types'
import { BigPizzaRosetteIcon } from './big/big-pizza-rosette-icon'

const TEXT_RADIUS = 76

export interface MediumPizzaRosetteProps {
  values: RosetteValue[]
  isUpcoming?: boolean
  className?: string
  isUnderReview?: boolean
}
export function MediumPizzaRosette(props: MediumPizzaRosetteProps) {
  const isUnderReview =
    props.isUnderReview ??
    props.values.every((value) => value.sentiment === 'UnderReview')

  const [first, second, third, fourth, fifth] = props.values
  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  return (
    <div className="relative w-[201px] h-[200px] p-8 whitespace-pre text-center font-medium text-[10px] uppercase leading-tight">
      <BigPizzaRosetteIcon
        values={props.values}
        className="h-[136px] w-[137px]"
        isUnderReview={isUnderReview}
      />
      <span
        style={{
          top: 100 - Math.cos((-4 * Math.PI) / 5) * TEXT_RADIUS,
          left: 100 + Math.sin((-4 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className="absolute -translate-x-1/2 origin-top rotate-[36deg]"
      >
        {first.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 100 - Math.cos((-2 * Math.PI) / 5) * TEXT_RADIUS,
          left: 100 + Math.sin((-2 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className="absolute -translate-x-1/2 -translate-y-full origin-bottom rotate-[-72deg]"
      >
        {second.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 100 - TEXT_RADIUS,
          left: '50%',
        }}
        className="absolute -translate-x-1/2 -translate-y-full"
      >
        {third.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 100 - Math.cos((2 * Math.PI) / 5) * TEXT_RADIUS,
          left: 100 + Math.sin((2 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className="absolute -translate-x-1/2 -translate-y-full origin-bottom rotate-[72deg]"
      >
        {fourth.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 100 - Math.cos((4 * Math.PI) / 5) * TEXT_RADIUS,
          left: 100 + Math.sin((4 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className="absolute -translate-x-1/2 origin-top rotate-[-36deg]"
      >
        {fifth.name.split(' ').join('\n')}
      </span>
    </div>
  )
}
