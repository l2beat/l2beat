import { assert } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import type { RosetteValue } from '../types'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
  hasNoBridge?: boolean
  className?: string
  background?: boolean
}

export function PentagonRosetteIcon({
  values,
  isUnderReview,
  hasNoBridge,
  className,
  background = true,
}: Props) {
  const svgRef = useRef(null)
  const context = useRosetteTooltipContext()
  const selectedRisk = context?.selectedRisk
  const setSelectedRisk = context?.setSelectedRisk

  useOnClickOutside(svgRef, () => setSelectedRisk?.(undefined))
  useEventListener('scroll', () => setSelectedRisk?.(undefined))

  const [first, second, third, fourth, fifth] = values

  const shouldGrayOut = !!isUnderReview || !!hasNoBridge

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue) => {
    setSelectedRisk?.(risk)
  }

  return (
    <svg
      width="198"
      height="188"
      viewBox="0 0 198 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      onMouseLeave={() => setSelectedRisk?.(undefined)}
      // Easiest way to move the center of the pentagon to the center of the div
      // It's basically percentage diff between r and R
      // See: https://uploads-cdn.omnicalculator.com/images//geometry/area/pentagon-calc-fixed.svg
      className={cn(className, 'translate-y-[-5.28%]')}
    >
      {background ? (
        <path
          d="M96.8716 2.00712C98.1411 1.08625 99.8589 1.08625 101.128 2.00712L195.424 70.4045C196.697 71.3276 197.229 72.9658 196.743 74.4607L160.728 185.122C160.242 186.615 158.85 187.625 157.281 187.625H40.7193C39.1495 187.625 37.7581 186.615 37.2723 185.122L1.25718 74.4607C0.77064 72.9658 1.30318 71.3276 2.57579 70.4045L96.8716 2.00712Z"
          fill="#323539"
          className="fill-gray-100 dark:fill-neutral-700"
        />
      ) : null}
      <path
        d="M105.815 97.5686C104.521 97.999 103.185 97.0352 103.185 95.6709L103.18 15.06C103.18 13.8367 104.565 13.1278 105.557 13.8434L182.715 69.5003C183.707 70.2159 183.471 71.7543 182.311 72.1402L105.815 97.5686Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(first.sentiment ?? 'neutral'),
          shouldGrayOut && sentimentToFillColor('UnderReview'),
          selectedRisk && selectedRisk.name !== first.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(first)}
        onTouchStart={() => selectRisk(first)}
      />
      <path
        d="M106.7 107.185C105.896 106.082 106.407 104.516 107.707 104.101L184.486 79.5422C185.651 79.1695 186.748 80.2732 186.369 81.4361L156.859 171.88C156.479 173.043 154.942 173.287 154.221 172.299L106.7 107.185Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(second.sentiment ?? 'neutral'),
          shouldGrayOut && sentimentToFillColor('UnderReview'),
          selectedRisk && selectedRisk.name !== second.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(second)}
        onTouchStart={() => selectRisk(second)}
      />
      <path
        d="M97.878 111.248C98.6763 110.142 100.324 110.142 101.122 111.248L148.285 176.622C149 177.614 148.292 179 147.068 179H51.9317C50.7085 179 49.9996 177.614 50.7153 176.622L97.878 111.248Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(third.sentiment ?? 'neutral'),
          shouldGrayOut && sentimentToFillColor('UnderReview'),
          selectedRisk && selectedRisk.name !== third.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(third)}
        onTouchStart={() => selectRisk(third)}
      />
      <path
        d="M90.3366 104.311C91.6374 104.722 92.1533 106.287 91.3524 107.391L44.0343 172.653C43.3162 173.643 41.7784 173.404 41.3953 172.242L11.6049 81.8903C11.2218 80.7285 12.3157 79.6214 13.482 79.9905L90.3366 104.311Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(fourth.sentiment ?? 'neutral'),
          shouldGrayOut && sentimentToFillColor('UnderReview'),
          selectedRisk && selectedRisk.name !== fourth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fourth)}
        onTouchStart={() => selectRisk(fourth)}
      />
      <path
        d="M94.9177 95.7581C94.9168 97.1225 93.5801 98.0854 92.2857 97.6543L15.8055 72.181C14.6449 71.7944 14.4102 70.2558 15.4027 69.5408L92.5928 13.9293C93.5854 13.2142 94.9704 13.924 94.9697 15.1473L94.9177 95.7581Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(fifth.sentiment ?? 'neutral'),
          shouldGrayOut && sentimentToFillColor('UnderReview'),
          selectedRisk && selectedRisk.name !== fifth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fifth)}
        onTouchStart={() => selectRisk(fifth)}
      />

      {isUnderReview ? (
        <>
          <path
            d="M93.213 110.444C92.978 110.443 92.7456 110.395 92.529 110.304C92.3124 110.213 92.116 110.08 91.9509 109.912C91.7858 109.745 91.6552 109.547 91.5668 109.329C91.4783 109.112 91.4336 108.879 91.4352 108.644C91.4583 103.844 91.613 101.909 92.5748 99.5769C93.8417 96.7447 95.736 94.2377 98.1143 92.2453C99.8567 90.8194 101.395 89.1606 102.685 87.3156C103.385 86.2612 103.796 85.0411 103.876 83.7778C103.96 83.0572 103.879 82.327 103.641 81.6418C103.402 80.9567 103.012 80.3343 102.499 79.8214C101.986 79.3084 101.364 78.9181 100.679 78.6796C99.9936 78.4412 99.2634 78.3608 98.5428 78.4444C94.9339 78.4444 93.6041 81.2107 93.261 83.9431C93.2153 84.3817 93.01 84.7883 92.6843 85.0856C92.3585 85.3828 91.9349 85.5501 91.4939 85.5556H80.7792C80.5389 85.5536 80.3014 85.5034 80.0809 85.4079C79.8604 85.3123 79.6613 85.1735 79.4955 84.9995C79.3296 84.8256 79.2005 84.6201 79.1156 84.3952C79.0307 84.1704 78.9919 83.9308 79.0014 83.6907C79.2503 76.6293 80.9872 73.5396 84.3686 70.4196C87.7926 67.2604 92.0877 66 98.5428 66C105.131 66 109.372 67.2444 112.719 70.1849C114.531 71.8453 115.952 73.8858 116.882 76.1602C117.812 78.4346 118.228 80.8866 118.099 83.3404C118.105 85.8948 117.509 88.4145 116.358 90.6951C114.841 93.4308 112.89 95.902 110.581 98.0124L107.265 101.168C105.199 103.183 104.005 105.927 103.938 108.812C103.901 109.255 103.7 109.669 103.373 109.97C103.047 110.272 102.619 110.441 102.175 110.443L93.213 110.444Z"
            fill="#FFC107"
          />
          <path
            d="M97.6529 130C102.071 130 105.653 126.418 105.653 122C105.653 117.582 102.071 114 97.6529 114C93.2346 114 89.6529 117.582 89.6529 122C89.6529 126.418 93.2346 130 97.6529 130Z"
            fill="#FFC107"
          />
        </>
      ) : null}

      {hasNoBridge ? (
        <>
          <path
            d="M99.001 132C103.419 132 107.001 128.418 107.001 124C107.001 119.582 103.419 116 99.001 116C94.5827 116 91.001 119.582 91.001 124C91.001 128.418 94.5827 132 99.001 132Z"
            fill="#FF3024"
          />
          <path
            d="M105.223 68H92.7784C92.5384 67.9998 92.3008 68.0482 92.08 68.1423C91.8592 68.2363 91.6597 68.3742 91.4935 68.5474C91.3274 68.7207 91.1981 68.9258 91.1134 69.1504C91.0287 69.375 90.9903 69.6144 91.0007 69.8542L92.7784 110.743C92.7982 111.201 92.9941 111.634 93.3254 111.951C93.6567 112.268 94.0977 112.445 94.5562 112.444H103.445C103.904 112.445 104.345 112.268 104.676 111.951C105.007 111.634 105.203 111.201 105.223 110.743L107.001 69.8542C107.011 69.6144 106.973 69.375 106.888 69.1504C106.803 68.9258 106.674 68.7207 106.508 68.5474C106.342 68.3742 106.142 68.2363 105.921 68.1423C105.701 68.0482 105.463 67.9998 105.223 68Z"
            fill="#FF3024"
          />
        </>
      ) : null}
    </svg>
  )
}
