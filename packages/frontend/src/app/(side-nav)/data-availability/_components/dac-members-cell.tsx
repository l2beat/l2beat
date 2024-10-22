import { type DacBridge } from '@l2beat/config'

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
    <div className="flex flex-col gap-0">
      <span className="text-sm font-medium leading-5">
        {requiredMembers}/{membersCount}
      </span>
      <span className="text-xs leading-none text-gray-500">
        {knownMembers ? 'Public' : 'Anonymous'}
      </span>
    </div>
  )
}
