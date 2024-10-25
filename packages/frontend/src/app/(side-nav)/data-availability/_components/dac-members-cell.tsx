import { type DacBridge } from '@l2beat/config'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'

type Props = Pick<
  DacBridge,
  'knownMembers' | 'requiredMembers' | 'membersCount'
>

export function DacMembersCell({
  knownMembers,
  requiredMembers,
  membersCount,
}: Props) {
  return (
    <TwoRowCell>
      <TwoRowCell.First className="leading-5">
        {requiredMembers}/{membersCount}
      </TwoRowCell.First>
      <TwoRowCell.Second>
        {knownMembers ? 'Public' : 'Anonymous'}
      </TwoRowCell.Second>
    </TwoRowCell>
  )
}
