import assert from 'assert'
import { cn } from '~/utils/cn'
import { type RosetteValue } from '../types'
import { type ContentState } from './big-rosette'

const TEXT_RADIUS = 102

export function BigRosetteLabels({
  values,
  content,
}: {
  values: RosetteValue[]
  content: ContentState | undefined
}) {
  const [first, second, third, fourth, fifth] = values
  assert(first && second && third && fourth && fifth, 'Invalid number of risks')
  const sharedClassName =
    'text-center font-medium text-xs uppercase leading-tight whitespace-pre select-none'
  return (
    <>
      <span
        style={{
          top: 138 - Math.cos((-4 * Math.PI) / 5) * TEXT_RADIUS,
          left: 138 + Math.sin((-4 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className={cn(
          'absolute -translate-x-1/2 origin-top rotate-[36deg]',
          sharedClassName,
          content && content.risk.name !== first.name && 'opacity-20',
        )}
      >
        {first.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 138 - Math.cos((-2 * Math.PI) / 5) * TEXT_RADIUS,
          left: 138 + Math.sin((-2 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className={cn(
          'absolute -translate-x-1/2 -translate-y-full origin-bottom rotate-[-72deg]',
          sharedClassName,
          content && content.risk.name !== second.name && 'opacity-20',
        )}
      >
        {second.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 138 - TEXT_RADIUS,
          left: '50%',
        }}
        className={cn(
          'absolute -translate-x-1/2 -translate-y-full',
          sharedClassName,
          content && content.risk.name !== third.name && 'opacity-20',
        )}
      >
        {third.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 138 - Math.cos((2 * Math.PI) / 5) * TEXT_RADIUS,
          left: 138 + Math.sin((2 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className={cn(
          'absolute -translate-x-1/2 -translate-y-full origin-bottom rotate-[72deg]',
          sharedClassName,
          content && content.risk.name !== fourth.name && 'opacity-20',
        )}
      >
        {fourth.name.split(' ').join('\n')}
      </span>
      <span
        style={{
          top: 138 - Math.cos((4 * Math.PI) / 5) * TEXT_RADIUS,
          left: 138 + Math.sin((4 * Math.PI) / 5) * TEXT_RADIUS,
        }}
        className={cn(
          'absolute -translate-x-1/2 origin-top rotate-[-36deg]',
          sharedClassName,
          content && content.risk.name !== fifth.name && 'opacity-20',
        )}
      >
        {fifth.name.split(' ').join('\n')}
      </span>
    </>
  )
}
