import { useRef } from 'react'
import { useEventListener } from '~/hooks/useEventListener'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { PizzaElementLink } from '../pizza/PizzaElementLink'
import type { RosetteValue } from '../types'
import { useIndividualRosetteTooltipContext } from './IndividualRosetteTooltipContext'

export type RosetteValueTuple = [
  sequencerFailure: RosetteValue,
  stateValidation: RosetteValue,
  dataAvailability: RosetteValue,
  exitWindow: RosetteValue,
  proposerFailure: RosetteValue,
]

interface Props {
  l2: {
    name: string
    risks: RosetteValueTuple
  }
  l3: {
    name: string
    risks: RosetteValueTuple
  }
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface'
  disableSectionLinking?: boolean
}

export function IndividualPizzaRosetteIcon({
  l2,
  l3,
  className,
  isUnderReview,
  background = 'header',
  disableSectionLinking,
}: Props) {
  const context = useIndividualRosetteTooltipContext()
  const svgRef = useRef(null)

  const [
    innerSequencerFailure,
    innerStateValidation,
    innerDataAvailability,
    innerExitWindow,
    innerProposeFailure,
  ] = l2.risks

  const [
    outerSequencerFailure,
    outerStateValidation,
    outerDataAvailability,
    outerExitWindow,
    outerProposeFailure,
  ] = l3.risks

  const setContent = context?.setContent
  const content = context?.content

  useOnClickOutside(svgRef, () => setContent?.(undefined))
  useEventListener('scroll', () => setContent?.(undefined))

  const selectRisk = (
    inner: RosetteValue,
    outer: RosetteValue,
    side: 'top' | 'bottom',
  ) => {
    setContent?.({
      inner,
      innerProjectName: l2.name,
      outer,
      outerProjectName: l3.name,
      side,
      // sideOffset: side === 'top' ? -65 : -50,
      sideOffset: 0,
    })
  }

  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      alt-text="Rosette showing risk summary"
      ref={svgRef}
      onMouseLeave={() => setContent?.(undefined)}
      className={cn(className)}
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

        <g clipPath="url(#inner-clip)">
          <PizzaElementLink
            elementValue={outerSequencerFailure}
            disableSectionLinking={disableSectionLinking}
          >
            <g
              onMouseEnter={() =>
                selectRisk(
                  innerSequencerFailure,
                  outerSequencerFailure,
                  'bottom',
                )
              }
              onTouchStart={() =>
                selectRisk(
                  innerSequencerFailure,
                  outerSequencerFailure,
                  'bottom',
                )
              }
              className={cn(
                content &&
                  content.inner.name !== innerSequencerFailure.name &&
                  'opacity-20',
                content &&
                  content.outer.name !== outerSequencerFailure.name &&
                  'opacity-20',
              )}
            >
              <path
                d="M80.12 98.19c2.588-.81 5.216 1.134 5.196 3.846l-.462 64.729c-.016 2.36-2.054 4.166-4.38 3.764-7.945-1.375-25.223-5.332-38.594-15.226-14.548-10.764-22.781-25.635-26.054-32.574-.978-2.071.16-4.429 2.346-5.114z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerSequencerFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
              <path
                d="M80.12 98.19c2.587-.81 5.215 1.134 5.196 3.846l-.268 37.64c-.017 2.36-2.055 4.161-4.37 3.705-5.53-1.09-15.295-3.695-23.015-9.408-8.396-6.213-13.49-14.573-15.924-19.376-1.035-2.043.096-4.402 2.282-5.088z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerSequencerFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerProposeFailure}
            disableSectionLinking={disableSectionLinking}
          >
            <g
              onMouseEnter={() =>
                selectRisk(innerProposeFailure, outerProposeFailure, 'bottom')
              }
              onTouchStart={() =>
                selectRisk(innerProposeFailure, outerProposeFailure, 'bottom')
              }
              className={cn(
                content &&
                  content.inner.name !== innerProposeFailure.name &&
                  'opacity-20',
                content &&
                  content.outer.name !== outerProposeFailure.name &&
                  'opacity-20',
              )}
            >
              <path
                d="M95.889 101.938c.028-2.712 2.69-4.61 5.262-3.754l61.419 20.441c2.239.746 3.327 3.241 2.226 5.329-3.763 7.132-12.865 22.341-26.407 32.001-14.733 10.509-31.42 13.744-39.03 14.713-2.273.289-4.164-1.522-4.14-3.812z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerProposeFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
              <path
                d="M95.889 101.938c.028-2.712 2.69-4.61 5.263-3.754l34.203 11.384c2.24.745 3.323 3.24 2.169 5.299-2.677 4.774-7.96 12.874-15.449 18.216-8.145 5.809-17.259 8.008-22.427 8.828-2.262.359-4.157-1.446-4.133-3.736z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerProposeFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerExitWindow}
            disableSectionLinking={disableSectionLinking}
          >
            <g
              onMouseEnter={() =>
                selectRisk(innerExitWindow, outerExitWindow, 'bottom')
              }
              onTouchStart={() =>
                selectRisk(innerExitWindow, outerExitWindow, 'bottom')
              }
              className={cn(
                content &&
                  content.inner.name !== innerExitWindow.name &&
                  'opacity-20',
                content &&
                  content.outer.name !== outerExitWindow.name &&
                  'opacity-20',
              )}
            >
              <path
                d="M102.815 89.056c-2.563-.887-3.519-4.014-1.89-6.182l38.873-51.758c1.418-1.888 4.13-2.128 5.76-.42 5.57 5.83 17.105 19.288 21.968 35.195 5.291 17.307 3.064 34.158 1.568 41.683-.446 2.246-2.764 3.465-4.928 2.716z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(outerExitWindow.sentiment ?? 'neutral'),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />

              <path
                d="M102.815 89.056c-2.563-.887-3.519-4.014-1.89-6.182l23.043-30.68c1.417-1.888 4.127-2.123 5.719-.38 3.85 4.215 10.285 12.265 13.147 21.627 3.113 10.181 2.203 20.12 1.285 25.495-.386 2.258-2.7 3.481-4.864 2.732z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(innerExitWindow.sentiment ?? 'neutral'),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerDataAvailability}
            disableSectionLinking={disableSectionLinking}
          >
            <g
              className={cn(
                content &&
                  content.inner.name !== innerDataAvailability.name &&
                  'opacity-20',
                content &&
                  content.outer.name !== outerDataAvailability.name &&
                  'opacity-20',
              )}
              onMouseEnter={() =>
                selectRisk(innerDataAvailability, outerDataAvailability, 'top')
              }
              onTouchStart={() =>
                selectRisk(innerDataAvailability, outerDataAvailability, 'top')
              }
            >
              <path
                d="M93.348 76.656c-1.598 2.192-4.867 2.192-6.465 0l-38.13-52.307c-1.391-1.908-.828-4.571 1.281-5.631C57.24 15.097 73.481 8 90.115 8c18.097 0 33.561 7.056 40.32 10.687 2.017 1.084 2.505 3.657 1.156 5.507z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerDataAvailability.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />

              <path
                d="M93.378 76.638c-1.599 2.166-4.839 2.166-6.438 0L64.802 46.632c-1.412-1.913-.84-4.597 1.314-5.603C71.221 38.644 80.588 35 90.16 35c10.407 0 19.447 3.62 24.274 6.005 2.069 1.022 2.568 3.615 1.197 5.472z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerDataAvailability.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerStateValidation}
            disableSectionLinking={disableSectionLinking}
          >
            <g
              onMouseEnter={() =>
                selectRisk(innerStateValidation, outerStateValidation, 'top')
              }
              onTouchStart={() =>
                selectRisk(innerStateValidation, outerStateValidation, 'top')
              }
              className={cn(
                content &&
                  content.inner.name !== innerStateValidation.name &&
                  'opacity-20',
                content &&
                  content.outer.name !== outerStateValidation.name &&
                  'opacity-20',
              )}
            >
              <path
                d="M79.696 83.036c1.552 2.224.487 5.316-2.105 6.113l-62.438 19.198c-2.256.693-4.59-.708-4.907-3.047-1.087-8.039-2.532-25.874 2.934-41.748 5.947-17.271 17.77-29.704 23.44-34.94 1.681-1.555 4.274-1.179 5.584.7z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerStateValidation.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />

              <path
                d="M79.696 83.037c1.552 2.224.487 5.315-2.105 6.112L43.025 99.777c-2.256.694-4.586-.708-4.843-3.055-.596-5.452-1.001-15.146 2.003-23.871 3.268-9.49 9.432-16.593 13.172-20.268 1.633-1.606 4.224-1.237 5.534.641z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerStateValidation.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
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

          <circle
            cx="90.1592"
            cy="90"
            r="52"
            className={cn(
              background === 'header' && 'stroke-header-secondary',
              background === 'surface' && 'stroke-surface-secondary',
            )}
            strokeWidth="10"
          />
        </g>
      </g>
    </svg>
  )
}
