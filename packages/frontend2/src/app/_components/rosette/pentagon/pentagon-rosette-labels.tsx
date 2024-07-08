import assert from 'assert'
import { cn } from '~/utils/cn'
import { type RosetteValue } from '../types'
import { type ContentState } from './big-pentagon-rosette'

interface Props {
  values: RosetteValue[]
  content: ContentState | undefined
  containerSize: number
  textRadius: number
  size?: 'small' | 'regular'
}

export function PentagonRosetteLabels({
  values,
  content,
  containerSize,
  textRadius,
  size = 'regular',
}: Props) {
  const [first, second, third, fourth, fifth] = values
  assert(first && second && third && fourth && fifth, 'Invalid number of risks')
  const sharedClassName = cn(
    size === 'small' && 'text-3xs',
    size === 'regular' && 'text-xs',
    'text-center font-medium uppercase leading-tight whitespace-pre select-none',
  )

  const containerCenter = containerSize / 2

  return (
    <>
      <span
        style={{
          top: containerCenter - Math.cos(Math.PI / 5) * textRadius,
          left: containerCenter + Math.sin(Math.PI / 5) * textRadius,
        }}
        className={cn(
          'absolute -translate-x-1/2 -translate-y-full origin-bottom rotate-[36deg]',
          sharedClassName,
          content && content.risk.name !== first.name && 'opacity-20',
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
          'absolute -translate-x-1/2 origin-top rotate-[-72deg]',
          sharedClassName,
          content && content.risk.name !== second.name && 'opacity-20',
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
          sharedClassName,
          content && content.risk.name !== third.name && 'opacity-20',
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
          'absolute -translate-x-1/2 origin-top rotate-[72deg]',
          sharedClassName,
          content && content.risk.name !== fourth.name && 'opacity-20',
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
          'absolute -translate-x-1/2 -translate-y-full origin-bottom rotate-[-36deg]',
          sharedClassName,
          content && content.risk.name !== fifth.name && 'opacity-20',
        )}
      >
        {fifth.name.split(' ').join('\n')}
      </span>
    </>
  )
}
