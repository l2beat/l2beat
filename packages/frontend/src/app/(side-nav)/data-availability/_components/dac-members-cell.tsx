import { NaBadge } from '~/components/badge/na-badge'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { type DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

interface Props {
  dacInfo: DaBridgeSummaryEntry['dacInfo']
}

export function DacMembersCell({ dacInfo }: Props) {
  if (!dacInfo) {
    return <NaBadge />
  }
  return (
    <TwoRowCell>
      <TwoRowCell.First className="leading-5">
        {dacInfo.requiredMemebers}/{dacInfo.memberCount}
      </TwoRowCell.First>
      <TwoRowCell.Second>
        {dacInfo.membersArePublic ? 'Public' : 'Anonymous'}
      </TwoRowCell.Second>
    </TwoRowCell>
  )
}
