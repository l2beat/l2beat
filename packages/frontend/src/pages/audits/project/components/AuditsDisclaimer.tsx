import { WarningBar } from '~/components/WarningBar'

export const AUDITS_DISCLAIMER =
  'Even a small difference from the audited code can introduce a vulnerability. Only code fully identical to an audited version could be considered secure. L2BEAT does not evaluate the diff from the audited version, only displays it.'

export function AuditsDisclaimer({ className }: { className?: string }) {
  return (
    <WarningBar
      color="yellow"
      text={AUDITS_DISCLAIMER}
      ignoreMarkdown
      className={className}
    />
  )
}
