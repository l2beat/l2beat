import { PRIVACY_ADVERSARIES_TOOLTIP } from './adversaries/privacyAdversaryUi'

export const PRIVACY_ASSESSMENT = {
  title: 'Privacy',
  tooltip: `${PRIVACY_ADVERSARIES_TOOLTIP} Hover a dot for more info.`,
  /** For the summary table, where the dots are folded into one rosette. */
  rosetteTooltip: `${PRIVACY_ADVERSARIES_TOOLTIP} The left half of the rosette holds one slice per adversary, the right half the protocol risks: trusted setup, exit window and reproducibility. Hover it for the verdict behind every slice.`,
} as const
