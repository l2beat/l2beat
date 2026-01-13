export type DisplayOption = {
  label: string
  tooltip?: string
}

export const DISPLAY_OPTIONS = {
  excludeRwaRestrictedTokens: {
    label: 'Exclude restricted RWA tokens',
    tooltip:
      'Centralized RWAs with access, transfer, transparency or onchain liquidity restrictions. A more formal framework for RWAs is in the works!',
  },
  excludeAssociatedTokens: {
    label: 'Exclude associated tokens',
  },
} satisfies Record<string, DisplayOption>

export type DisplayOptionsKey = keyof typeof DISPLAY_OPTIONS
