import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import {
  type BigPentagonRosetteProps,
  type ContentState,
} from './big-pentagon-rosette'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { assert } from '@l2beat/shared-pure'
import { type RosetteValue } from '../types'
import { sentimentToFillColor } from '~/utils/sentiment'
import { cn } from '~/utils/cn'

interface Props extends BigPentagonRosetteProps {
  content?: ContentState
  setContent?: (content: ContentState | undefined) => void
  background?: boolean
}

export function PentagonRosetteIcon({
  values,
  isUpcoming,
  isUnderReview,
  className,
  content,
  setContent,
  background = true,
}: Props) {
  const svgRef = useRef(null)
  const [first, second, third, fourth, fifth] = values
  useOnClickOutside(svgRef, () => setContent?.(undefined))
  useEventListener('scroll', () => setContent?.(undefined))

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue, side: 'top' | 'bottom') => {
    setContent?.({
      risk,
      side: side,
      sideOffset: side === 'top' ? -65 : -60,
    })
  }

  return (
    <svg
      width="198"
      height="188"
      viewBox="0 0 198 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      className={cn(className, isUpcoming && 'opacity-30')}
      onMouseLeave={() => setContent?.(undefined)}
    >
      {background ? (
        <path
          d="M96.8716 2.00712C98.1411 1.08625 99.8589 1.08625 101.128 2.00712L195.424 70.4045C196.697 71.3276 197.229 72.9658 196.743 74.4607L160.728 185.122C160.242 186.615 158.85 187.625 157.281 187.625H40.7193C39.1495 187.625 37.7581 186.615 37.2723 185.122L1.25718 74.4607C0.77064 72.9658 1.30318 71.3276 2.57579 70.4045L96.8716 2.00712Z"
          fill="#323539"
          stroke="#505357"
          strokeWidth="0.75"
        />
      ) : null}
      <path
        d="M105.815 97.5686C104.521 97.999 103.185 97.0352 103.185 95.6709L103.18 15.06C103.18 13.8367 104.565 13.1278 105.557 13.8434L182.715 69.5003C183.707 70.2159 183.471 71.7543 182.311 72.1402L105.815 97.5686Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(first.sentiment),
          content && content.risk.name !== first.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(first, 'bottom')}
        onTouchStart={() => selectRisk(first, 'bottom')}
      />
      <path
        d="M106.7 107.185C105.896 106.082 106.407 104.516 107.707 104.101L184.486 79.5422C185.651 79.1695 186.748 80.2732 186.369 81.4361L156.859 171.88C156.479 173.043 154.942 173.287 154.221 172.299L106.7 107.185Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(second.sentiment),
          content && content.risk.name !== second.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(second, 'top')}
        onTouchStart={() => selectRisk(second, 'top')}
      />
      <path
        d="M97.878 111.248C98.6763 110.142 100.324 110.142 101.122 111.248L148.285 176.622C149 177.614 148.292 179 147.068 179H51.9317C50.7085 179 49.9996 177.614 50.7153 176.622L97.878 111.248Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(third.sentiment),
          content && content.risk.name !== third.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(third, 'top')}
        onTouchStart={() => selectRisk(third, 'top')}
      />
      <path
        d="M90.3366 104.311C91.6374 104.722 92.1533 106.287 91.3524 107.391L44.0343 172.653C43.3162 173.643 41.7784 173.404 41.3953 172.242L11.6049 81.8903C11.2218 80.7285 12.3157 79.6214 13.482 79.9905L90.3366 104.311Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(fourth.sentiment),
          content && content.risk.name !== fourth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fourth, 'top')}
        onTouchStart={() => selectRisk(fourth, 'top')}
      />
      <path
        d="M94.9177 95.7581C94.9168 97.1225 93.5801 98.0854 92.2857 97.6543L15.8055 72.181C14.6449 71.7944 14.4102 70.2558 15.4027 69.5408L92.5928 13.9293C93.5854 13.2142 94.9704 13.924 94.9697 15.1473L94.9177 95.7581Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(fifth.sentiment),
          content && content.risk.name !== fifth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fifth, 'bottom')}
        onTouchStart={() => selectRisk(fifth, 'bottom')}
      />
    </svg>
  )
}
