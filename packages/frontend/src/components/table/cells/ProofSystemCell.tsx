import type {
  ProjectScalingProofSystem,
  ProjectScalingStack,
} from '@l2beat/config'
import { TableLink } from '../TableLink'
import { TwoRowCell } from './TwoRowCell'
import { TypeInfo } from './TypeInfo'

interface ProofSystemCellProps {
  proofSystem: ProjectScalingProofSystem | undefined
  slug: string
  stacks?: ProjectScalingStack[]
  hideType?: boolean
  permissioned?: boolean
}

export function ProofSystemCell({
  proofSystem,
  slug,
  stacks,
  hideType,
  permissioned,
}: ProofSystemCellProps) {
  const secondLine =
    permissioned !== undefined
      ? permissioned
        ? 'Permissioned'
        : 'Permissionless'
      : proofSystem?.name && !hideType
        ? proofSystem.name
        : undefined
  // A single ZK Catalog project can be highlighted directly; multi-proof
  // systems link to the project's state validation section, which lists all
  // of them.
  const zkCatalogIds = proofSystem?.zkCatalogIds ?? []
  return (
    <TableLink
      href={
        !proofSystem?.type
          ? undefined
          : zkCatalogIds.length === 1
            ? `/zk-catalog?highlight=${zkCatalogIds[0]}`
            : `/scaling/projects/${slug}#state-validation`
      }
    >
      <TwoRowCell>
        <TwoRowCell.First>
          {hideType && proofSystem?.name ? (
            <TypeInfo stacks={stacks}>{proofSystem.name}</TypeInfo>
          ) : (
            <TypeInfo stacks={stacks}>{proofSystem?.type ?? 'None'}</TypeInfo>
          )}
        </TwoRowCell.First>
        {secondLine && <TwoRowCell.Second>{secondLine}</TwoRowCell.Second>}
      </TwoRowCell>
    </TableLink>
  )
}
