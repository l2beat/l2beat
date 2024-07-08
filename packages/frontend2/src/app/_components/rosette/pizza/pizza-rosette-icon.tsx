import assert from 'assert'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { type RosetteValue } from '../types'
import { useRef } from 'react'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { useEventListener } from '~/hooks/use-event-listener'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  background?: boolean
}

export function PizzaRosetteIcon({
  values,
  className,
  isUnderReview,
  background = true,
}: Props) {
  const context = useRosetteTooltipContext()
  const svgRef = useRef(null)

  const [first, second, third, fourth, fifth] = values
  const setContent = context?.setContent
  const content = context?.content

  useOnClickOutside(svgRef, () => setContent?.(undefined))
  useEventListener('scroll', () => setContent?.(undefined))

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue, side: 'top' | 'bottom') => {
    setContent?.({
      risk,
      side: side,
      sideOffset: side === 'top' ? -65 : -50,
    })
  }

  return (
    <svg
      width="181"
      height="180"
      viewBox="0 0 181 180"
      alt-text="Rosette showing risk summary"
      ref={svgRef}
      onMouseLeave={() => setContent?.(undefined)}
      className={className}
    >
      {background ? (
        <circle
          cx="90.8408"
          cy="90"
          r="90"
          className="fill-gray-100 dark:fill-neutral-700"
        />
      ) : null}

      <path
        d="M80.8589 98.2024C83.4853 97.3765 86.1548 99.3485 86.1374 102.102L85.7291 166.681C85.7139 169.077 83.649 170.912 81.288 170.504C73.3126 169.126 56.0884 165.178 42.7447 155.321C28.2279 144.597 19.9876 129.784 16.6906 122.825C15.6954 120.724 16.8492 118.33 19.0669 117.632L80.8589 98.2024Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(first.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== first.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(first, 'top')}
        onTouchStart={() => selectRisk(first, 'top')}
      />

      <path
        d="M80.4851 82.9885C82.0593 85.2473 80.9768 88.3846 78.3447 89.1921L16.604 108.133C14.3134 108.836 11.9444 107.415 11.6271 105.04C10.555 97.018 9.16596 79.4018 14.5768 63.7194C20.4634 46.6582 32.1303 34.3618 37.7841 29.1327C39.4908 27.5543 42.1203 27.9386 43.4495 29.8458L80.4851 82.9885Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(second.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== second.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(second, 'bottom')}
        onTouchStart={() => selectRisk(second, 'bottom')}
      />

      <path
        d="M94.4599 77.5583C92.8302 79.7773 89.5113 79.7654 87.8975 77.5349L50.0417 25.2126C48.6372 23.2713 49.2175 20.5705 51.3629 19.5036C58.6097 15.8996 74.8347 8.89881 91.4242 8.95819C109.472 9.02278 124.876 16.0963 131.65 19.7596C133.695 20.8655 134.18 23.4783 132.804 25.352L94.4599 77.5583Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(third.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== third.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(third, 'bottom')}
        onTouchStart={() => selectRisk(third, 'bottom')}
      />

      <path
        d="M103.756 89.1339C101.153 88.2379 100.177 85.0657 101.827 82.8615L140.521 31.1566C141.957 29.2382 144.708 28.9889 146.365 30.7199C151.961 36.5668 163.471 49.9752 168.349 65.8316C173.655 83.082 171.483 99.8928 170.001 107.45C169.553 109.731 167.203 110.971 165.005 110.215L103.756 89.1339Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(fourth.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== fourth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fourth, 'bottom')}
        onTouchStart={() => selectRisk(fourth, 'bottom')}
      />

      <path
        d="M95.5409 102.181C95.5486 99.428 98.2361 97.4805 100.855 98.3304L162.282 118.265C164.561 119.005 165.685 121.528 164.581 123.655C160.854 130.839 151.878 146.061 138.445 155.795C123.83 166.385 107.218 169.756 99.5872 170.792C97.2836 171.105 95.3511 169.28 95.3577 166.956L95.5409 102.181Z"
        className={cn(
          'transition-opacity duration-50',
          sentimentToFillColor(fifth.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== fifth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fifth, 'top')}
        onTouchStart={() => selectRisk(fifth, 'top')}
      />

      {isUnderReview ? (
        <>
          <path
            d="M85.1534 102.444C84.9184 102.443 84.686 102.395 84.4694 102.304C84.2528 102.213 84.0564 102.08 83.8913 101.912C83.7262 101.745 83.5956 101.547 83.5072 101.329C83.4187 101.112 83.374 100.879 83.3756 100.644C83.3987 95.8436 83.5534 93.9093 84.5152 91.5769C85.7821 88.7447 87.6764 86.2377 90.0547 84.2453C91.7971 82.8194 93.3351 81.1606 94.6254 79.3156C95.3259 78.2612 95.7367 77.0411 95.8165 75.7778C95.9002 75.0572 95.8198 74.327 95.5813 73.6418C95.3429 72.9567 94.9526 72.3343 94.4396 71.8214C93.9266 71.3084 93.3043 70.9181 92.6191 70.6796C91.934 70.4412 91.2038 70.3608 90.4832 70.4444C86.8743 70.4444 85.5445 73.2107 85.2014 75.9431C85.1557 76.3817 84.9504 76.7883 84.6247 77.0856C84.2989 77.3828 83.8753 77.5501 83.4343 77.5556H72.7196C72.4793 77.5536 72.2418 77.5034 72.0213 77.4079C71.8008 77.3123 71.6017 77.1735 71.4359 76.9995C71.27 76.8256 71.1409 76.6201 71.056 76.3952C70.9711 76.1704 70.9323 75.9308 70.9418 75.6907C71.1907 68.6293 72.9276 65.5396 76.309 62.4196C79.733 59.2604 84.0281 58 90.4832 58C97.0716 58 101.312 59.2444 104.659 62.1849C106.471 63.8453 107.892 65.8858 108.822 68.1602C109.752 70.4346 110.168 72.8866 110.039 75.3404C110.045 77.8948 109.449 80.4145 108.298 82.6951C106.781 85.4308 104.83 87.902 102.521 90.0124L99.205 93.168C97.1396 95.1834 95.9456 97.9275 95.8787 100.812C95.8418 101.255 95.6403 101.669 95.3138 101.97C94.9874 102.272 94.5597 102.441 94.1152 102.443L85.1534 102.444Z"
            fill="#FFC107"
          />
          <path
            d="M89.5933 122C94.0115 122 97.5933 118.418 97.5933 114C97.5933 109.582 94.0115 106 89.5933 106C85.175 106 81.5933 109.582 81.5933 114C81.5933 118.418 85.175 122 89.5933 122Z"
            fill="#FFC107"
          />
        </>
      ) : null}
    </svg>
  )
}
