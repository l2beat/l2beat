import { NaBadge } from '~/components/badge/na-badge'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

interface Props {
  dacInfo: DaBridgeSummaryEntry['dacInfo']
}

export function DacMembersCell({ dacInfo }: Props) {
  if (!dacInfo) {
    return <NaBadge />
  }
  return (
    <TableValueCell
      value={{
        value: `${dacInfo.requiredMembers}/${dacInfo.memberCount}`,
        secondLine: dacInfo.membersArePublic ? 'Public' : 'Anonymous',
      }}
    />
  )
}
