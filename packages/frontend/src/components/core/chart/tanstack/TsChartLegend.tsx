import { useRef } from 'react'
import { CursorClickIcon } from '~/icons/CursorClick'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../../OverflowWrapper'
import { useChart } from '../ChartContext'
import { ChartDataIndicator } from '../ChartDataIndicator'
import {
  legendOnboardingHintClassName,
  useChartLegendOnboarding,
} from '../ChartLegendOnboardingContext'

/** `ChartLegendContent` without Recharts: items come from the chart meta. */
export function TsChartLegend() {
  const contentRef = useRef<HTMLDivElement>(null)
  const { meta, interactiveLegend } = useChart()
  const {
    hasFinishedOnboarding,
    setHasFinishedOnboarding,
    hasFinishedOnboardingInitial,
  } = useChartLegendOnboarding()

  const items = Object.entries(meta).flatMap(([key, config]) =>
    config ? [{ key, config }] : [],
  )
  if (items.length === 0) return null

  return (
    <div
      className={cn(
        'ts-legend relative pt-1',
        interactiveLegend &&
          !hasFinishedOnboardingInitial &&
          !interactiveLegend.disableOnboarding &&
          'mb-3',
      )}
    >
      <div className="mx-auto flex w-max max-w-full items-center">
        <OverflowWrapper childrenRef={contentRef} className="min-w-0">
          <div className="flex h-3.5 w-max items-center gap-2" ref={contentRef}>
            {items.map(({ key, config }) => {
              const isHidden =
                interactiveLegend && !interactiveLegend.dataKeys.includes(key)
              return (
                <div
                  key={key}
                  className={cn(
                    'group/legend-item flex items-center gap-[3px] transition-opacity [&>svg]:text-secondary',
                    interactiveLegend && 'cursor-pointer select-none',
                    isHidden && 'opacity-50',
                  )}
                  onClick={
                    interactiveLegend
                      ? () => {
                          interactiveLegend.onItemClick(key)
                          if (!interactiveLegend.disableOnboarding) {
                            setHasFinishedOnboarding(true)
                          }
                        }
                      : undefined
                  }
                >
                  <ChartDataIndicator
                    type={config.indicatorType}
                    backgroundColor={config.color}
                  />
                  <span
                    className={cn(
                      'text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px] transition-opacity',
                      !isHidden &&
                        interactiveLegend &&
                        'group-hover/legend-item:opacity-50',
                      isHidden && 'line-through',
                    )}
                  >
                    {config.legendLabel ?? config.label}
                  </span>
                </div>
              )
            })}
          </div>
        </OverflowWrapper>
      </div>
      {!hasFinishedOnboarding &&
        interactiveLegend &&
        !interactiveLegend.disableOnboarding && (
          <div
            className={cn(
              '-bottom-4 pointer-events-none absolute inset-x-0 min-w-44 rounded-xs text-center text-brand text-label-value-12 italic transition-[opacity,scale] ease-out group-hover:scale-[1.15]',
              legendOnboardingHintClassName,
            )}
            data-legend-onboarding-hint=""
          >
            <CursorClickIcon className="-top-0.5 relative inline-block fill-current" />
            Try clicking legend items to toggle data
          </div>
        )}
    </div>
  )
}
