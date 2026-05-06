import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'
import { InteropProjectNameTooltip } from '~/pages/interop/components/table/InteropProjectNameTooltip'
import { SubgroupTooltip } from '~/pages/interop/components/table/SubgroupTooltip'

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
  return (
    <InteropProjectNameTooltip
      projectName={shortName ?? name}
      description={description}
    >
      <TableLink href={`/interop/protocols/${slug}`}>
        <TwoRowCell>
          <TwoRowCell.First className="flex items-center gap-2 pr-1 leading-none!">
            <div className="w-fit max-w-[76px] break-words font-bold text-label-value-15 md:leading-none">
              {shortName ?? name}
            </div>
            {subgroup && <SubgroupTooltip subgroup={subgroup} />}
          </TwoRowCell.First>
          <TwoRowCell.Second>{isAggregate && 'Aggregate'}</TwoRowCell.Second>
        </TwoRowCell>
      </TableLink>
    </InteropProjectNameTooltip>
  )
}
