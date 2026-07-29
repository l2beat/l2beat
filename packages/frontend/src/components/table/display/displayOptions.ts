export type DisplayOption = {
  label: string
  tooltip?: string
}

export const DISPLAY_OPTIONS = {
  excludeRwaRestrictedTokens: {
    label: 'Exclude restricted RWA tokens',
    tooltip:
      'Centralized RWAs with access or transfer restrictions, whitelists, no onchain liquidity or integration, hardcoded prices or very low activity.',
  },
  excludeAssociatedTokens: {
    label: 'Exclude associated tokens',
  },
} satisfies Record<string, DisplayOption>

export type DisplayOptionsKey = keyof typeof DISPLAY_OPTIONS
