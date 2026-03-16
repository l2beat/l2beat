import { Badge } from './Badge'

interface ProtocolTypeBadgeProps {
  type: string
}

export const TYPE_LABELS: Record<string, string> = {
  stablecoin: 'Stablecoin',
  lending: 'Lending',
  dex: 'DEX',
  bridge: 'Bridge',
  derivatives: 'Derivatives',
  yield: 'Yield',
  'liquid-staking': 'Liquid Staking',
  cdp: 'Stablecoin',
  other: 'Other',
}

export function ProtocolTypeBadge({ type }: ProtocolTypeBadgeProps) {
  return <Badge variant="purple">{TYPE_LABELS[type] ?? type}</Badge>
}
