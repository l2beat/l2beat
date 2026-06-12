import { assert } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/useEventListener'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { useRosetteTooltipContext } from '../RosetteTooltipContext'
import type { RosetteValue } from '../types'
import { PizzaElementLink } from './PizzaElementLink'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface' | false
  disableSectionLinking?: boolean
}

export function PizzaRosetteIcon({
  values,
  className,
  isUnderReview,
  background = 'header',
  disableSectionLinking,
}: Props) {
  const context = useRosetteTooltipContext()
  const svgRef = useRef(null)

  const [first, second, third, fourth, fifth] = values
  const setSelectedRisk = context?.setSelectedRisk
  const selectedRisk = context?.selectedRisk

  useOnClickOutside(svgRef, () => setSelectedRisk?.(undefined))
  useEventListener('scroll', () => setSelectedRisk?.(undefined))

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue) => {
    setSelectedRisk?.(risk)
  }

  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      alt-text="Rosette showing risk summary"
      ref={svgRef}
      onMouseLeave={() => setSelectedRisk?.(undefined)}
      className={className}
    >
      <defs>
        <clipPath id="outer-clip">
          <rect width="180" height="180" rx="90" />
        </clipPath>
        <clipPath id="inner-clip">
          <rect
            x="73.0898"
            y="-23.5745"
            width="162.422"
            height="162.422"
            rx="81.2112"
            transform="rotate(36.4535 73.0898 -23.5745)"
          />
        </clipPath>
      </defs>

      <g clipPath="url(#outer-clip)">
        {background && (
          <circle
            cx="90"
            cy="90"
            r="90"
            className={cn(
              'stroke-2 stroke-divider',
              background === 'header' && 'fill-header-secondary',
              background === 'surface' && 'fill-surface-secondary',
            )}
          />
        )}
        <g clipPath="url(#inner-clip)">
          <PizzaElementLink
            elementValue={first}
            disableSectionLinking={disableSectionLinking}
          >
            <path
              d="M80.12 98.19c2.588-.81 5.216 1.134 5.196 3.846l-.462 64.729c-.016 2.36-2.054 4.166-4.38 3.764-7.945-1.375-25.223-5.332-38.594-15.226-14.548-10.764-22.781-25.635-26.054-32.574-.978-2.071.16-4.429 2.346-5.114z"
              className={cn(
                'transition-opacity',
                sentimentToFillColor(first.sentiment ?? 'neutral'),
                isUnderReview && sentimentToFillColor('UnderReview'),
                selectedRisk &&
                  selectedRisk.name !== first.name &&
                  'opacity-20',
              )}
              onMouseEnter={() => selectRisk(first)}
              onTouchStart={() => selectRisk(first)}
            />
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={second}
            disableSectionLinking={disableSectionLinking}
          >
            <path
              d="M79.696 83.036c1.552 2.224.487 5.316-2.105 6.113l-62.438 19.198c-2.256.693-4.59-.708-4.907-3.047-1.087-8.039-2.532-25.874 2.934-41.748 5.947-17.271 17.77-29.704 23.44-34.94 1.681-1.555 4.274-1.179 5.584.7z"
              className={cn(
                'transition-opacity',
                sentimentToFillColor(second.sentiment ?? 'neutral'),
                isUnderReview && sentimentToFillColor('UnderReview'),
                selectedRisk &&
                  selectedRisk.name !== second.name &&
                  'opacity-20',
              )}
              onMouseEnter={() => selectRisk(second)}
              onTouchStart={() => selectRisk(second)}
            />
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={third}
            disableSectionLinking={disableSectionLinking}
          >
            <path
              d="M93.348 76.656c-1.598 2.192-4.867 2.192-6.465 0l-38.13-52.307c-1.391-1.908-.828-4.571 1.281-5.631C57.24 15.097 73.481 8 90.115 8c18.097 0 33.561 7.056 40.32 10.687 2.017 1.084 2.505 3.657 1.156 5.507z"
              className={cn(
                'transition-opacity',
                sentimentToFillColor(third.sentiment ?? 'neutral'),
                isUnderReview && sentimentToFillColor('UnderReview'),
                selectedRisk &&
                  selectedRisk.name !== third.name &&
                  'opacity-20',
              )}
              onMouseEnter={() => selectRisk(third)}
              onTouchStart={() => selectRisk(third)}
            />
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={fourth}
            disableSectionLinking={disableSectionLinking}
          >
            <path
              d="M102.815 89.056c-2.563-.887-3.519-4.014-1.89-6.182l38.873-51.758c1.418-1.888 4.13-2.128 5.76-.42 5.57 5.83 17.105 19.288 21.968 35.195 5.291 17.307 3.064 34.158 1.568 41.683-.446 2.246-2.764 3.465-4.928 2.716z"
              className={cn(
                'transition-opacity',
                sentimentToFillColor(fourth.sentiment ?? 'neutral'),
                isUnderReview && sentimentToFillColor('UnderReview'),
                selectedRisk &&
                  selectedRisk.name !== fourth.name &&
                  'opacity-20',
              )}
              onMouseEnter={() => selectRisk(fourth)}
              onTouchStart={() => selectRisk(fourth)}
            />
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={fifth}
            disableSectionLinking={disableSectionLinking}
          >
            <path
              d="M95.889 101.938c.028-2.712 2.69-4.61 5.262-3.754l61.419 20.441c2.239.746 3.327 3.241 2.226 5.329-3.763 7.132-12.865 22.341-26.407 32.001-14.733 10.509-31.42 13.744-39.03 14.713-2.273.289-4.164-1.522-4.14-3.812z"
              className={cn(
                'transition-opacity',
                sentimentToFillColor(fifth.sentiment ?? 'neutral'),
                isUnderReview && sentimentToFillColor('UnderReview'),
                selectedRisk &&
                  selectedRisk.name !== fifth.name &&
                  'opacity-20',
              )}
              onMouseEnter={() => selectRisk(fifth)}
              onTouchStart={() => selectRisk(fifth)}
            />
          </PizzaElementLink>

          {isUnderReview ? (
            <>
              <path
                d="M83.072 109a2.64 2.64 0 01-1.871-.79 2.64 2.64 0 01-.765-1.883c.034-7.129.263-10.001 1.69-13.465a30.4 30.4 0 018.212-10.887 36.4 36.4 0 006.776-7.321A10.7 10.7 0 0098.88 69.4a7.15 7.15 0 00-2.041-5.875 7.13 7.13 0 00-5.866-2.045c-5.35 0-7.322 4.108-7.83 8.166a2.666 2.666 0 01-2.62 2.395H64.638a2.66 2.66 0 01-2.636-2.77c.37-10.486 2.944-15.075 7.957-19.708C75.035 44.872 81.403 43 90.973 43c9.768 0 16.055 1.848 21.017 6.215a24.7 24.7 0 016.172 8.873 24.8 24.8 0 011.804 10.663 24.15 24.15 0 01-2.581 10.922 42.9 42.9 0 01-8.565 10.866l-4.916 4.686a16.4 16.4 0 00-4.931 11.351 2.64 2.64 0 01-2.615 2.423z"
                fill="#FFC107"
              />
              <path
                d="M90 138c6.627 0 12-5.373 12-12s-5.373-12-12-12-12 5.373-12 12 5.373 12 12 12"
                fill="#FFC107"
              />
            </>
          ) : null}
        </g>
      </g>
    </svg>
  )
}
