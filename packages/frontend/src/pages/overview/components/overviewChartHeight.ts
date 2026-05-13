// Shrinks the embedded Recharts container height inside the overview cards
// without affecting other usages of the shared chart components.
export const OVERVIEW_CHART_HEIGHT_CLASS =
  '[&_.recharts-responsive-container]:!h-[160px] [&_.recharts-responsive-container]:!min-h-[160px] md:[&_.recharts-responsive-container]:!h-[180px] md:[&_.recharts-responsive-container]:!min-h-[180px] 2xl:[&_.recharts-responsive-container]:!h-[200px] 2xl:[&_.recharts-responsive-container]:!min-h-[200px]'

// Slim vertical padding for the overview chart / What's new cards so there's
// less empty space below the chart legend; overrides PrimaryCard's md:py-5.
export const OVERVIEW_CARD_PADDING_CLASS = 'md:py-3'
