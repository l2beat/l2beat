import type { PrivacyExitWindow } from '@l2beat/config'
import { PrivacySummaryValueCell } from './PrivacySummaryValueCell'

export function PrivacyExitWindowCell({
  exitWindow,
}: {
  exitWindow: PrivacyExitWindow
}) {
  return <PrivacySummaryValueCell value={exitWindow} showValue />
}
