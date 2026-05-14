// Shrinks the embedded Recharts container height inside the overview cards
// without affecting other usages of the shared chart components.
export const OVERVIEW_CHART_HEIGHT_CLASS =
  '[&_.recharts-responsive-container]:!h-[112px] [&_.recharts-responsive-container]:!min-h-[112px] md:[&_.recharts-responsive-container]:!h-[128px] md:[&_.recharts-responsive-container]:!min-h-[128px] 2xl:[&_.recharts-responsive-container]:!h-[136px] 2xl:[&_.recharts-responsive-container]:!min-h-[136px]'

// Slim vertical padding for the overview chart / What's new cards so there's
// less empty space below the chart legend; overrides PrimaryCard's md:py-5.
export const OVERVIEW_CARD_PADDING_CLASS = 'md:py-3'

/** Full-width chart area inside overview cards (no horizontal inset). */
export const OVERVIEW_CHART_RIGHT_INSET_CLASS = 'min-w-0 w-full'
