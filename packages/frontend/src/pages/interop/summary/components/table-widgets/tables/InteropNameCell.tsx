import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'
import { env } from '~/env'
import { InteropProjectNameTooltip } from '~/pages/interop/components/table/InteropProjectNameTooltip'
import { SubgroupTooltip } from '~/pages/interop/components/table/SubgroupTooltip'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'

interface Props {
  shortName?: string
  slug: string
  name: string
  description?: string
  subgroup?: {
    name: string
    iconUrl: string
  }
  isAggregate?: boolean
}

export function InteropNameCell({
  shortName,
  slug,
  name,
  description,
  subgroup,
  isAggregate,
}: Props) {
  const { buildUrl } = useInteropSelectedChains()

  const nameCell = (
    <TwoRowCell>
      <TwoRowCell.First className="flex items-center gap-2 pr-1 leading-none!">
        <div className="w-fit max-w-[76px] break-words font-bold text-label-value-15 md:leading-none">
          {shortName ?? name}
        </div>
        {subgroup && <SubgroupTooltip subgroup={subgroup} />}
      </TwoRowCell.First>
      <TwoRowCell.Second>{isAggregate && 'Aggregate'}</TwoRowCell.Second>
    </TwoRowCell>
  )

  const content = env.CLIENT_SIDE_INTEROP_DETAILED_PAGES ? (
    <TableLink href={buildUrl(`/interop/protocols/${slug}`)}>
      {nameCell}
    </TableLink>
  ) : (
    nameCell
  )

  return (
    <InteropProjectNameTooltip
      projectName={shortName ?? name}
      description={description}
    >
      {content}
    </InteropProjectNameTooltip>
  )
}
