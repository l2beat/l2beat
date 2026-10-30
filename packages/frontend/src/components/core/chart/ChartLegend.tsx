import { type ReactNode, useRef } from 'react'
import { CursorClickIcon } from '~/icons/CursorClick'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../OverflowWrapper'
import { useChart } from './ChartContext'
import { ChartDataIndicator } from './ChartDataIndicator'
import {
  legendOnboardingHintClassName,
  useChartLegendOnboarding,
  useLegendHint,
} from './ChartLegendOnboardingContext'

/** The legend under a chart; items come from the chart meta, in order. */
export function ChartLegend({
  leading,
  align = 'center',
  className,
}: {
  leading?: ReactNode
  align?: 'center' | 'start'
  className?: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { meta, interactiveLegend } = useChart()
  const { setHasFinishedOnboarding } = useChartLegendOnboarding()
  const { showsHint, keepsRoom } = useLegendHint(interactiveLegend)

  const items = Object.entries(meta).flatMap(([key, config]) =>
    config ? [{ key, config }] : [],
  )
  if (items.length === 0) return null

  return (
    <div
      className={cn(
        'chart-legend relative pt-1',
        keepsRoom && 'mb-3',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max max-w-full items-center',
          align === 'center' && 'mx-auto',
        )}
      >
        {leading}
        {/* the padding keeps a focused item clear of the 30px edge fades */}
        <OverflowWrapper
          childrenRef={contentRef}
          className="min-w-0"
          childrenClassName="scroll-px-[30px]"
        >
          <div className="flex h-3.5 w-max items-center gap-2" ref={contentRef}>
            {items.map(({ key, config }) => {
              const isHidden =
                interactiveLegend && !interactiveLegend.dataKeys.includes(key)
              const Item = interactiveLegend ? 'button' : 'div'
              return (
                <Item
                  key={key}
                  type={interactiveLegend ? 'button' : undefined}
                  aria-pressed={interactiveLegend ? !isHidden : undefined}
                  className={cn(
                    'group/legend-item flex items-center gap-[3px] *:transition-opacity [&>svg]:text-secondary',
                    interactiveLegend &&
                      'focus-visible:-outline-offset-1 cursor-pointer select-none rounded-xs focus-visible:outline-1 focus-visible:outline-brand',
                    // dims the content only, so the focus outline keeps its contrast
                    isHidden && '*:opacity-50',
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
                  // Chrome leaves a partly visible item where it is on focus
                  onFocus={
                    interactiveLegend
                      ? (e) =>
                          e.currentTarget.scrollIntoView({
                            block: 'nearest',
                            inline: 'nearest',
                          })
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
                </Item>
              )
            })}
          </div>
        </OverflowWrapper>
      </div>
      {showsHint && (
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
