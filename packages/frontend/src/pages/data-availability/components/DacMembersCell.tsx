import { NaBadge } from '~/components/badge/NaBadge'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'

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
