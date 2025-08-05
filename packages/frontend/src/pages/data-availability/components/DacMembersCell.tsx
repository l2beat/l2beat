import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'

interface Props {
  dacInfo: DaBridgeSummaryEntry['dacInfo']
}

export function DacMembersCell({ dacInfo }: Props) {
  if (!dacInfo) {
    return <NotApplicableBadge />
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
