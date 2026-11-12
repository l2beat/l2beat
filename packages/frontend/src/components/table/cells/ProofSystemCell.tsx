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
  /** For a compact table: only the type; the project page names the system. */
  compact?: boolean
}

export function ProofSystemCell({
  proofSystem,
  slug,
  stacks,
  hideType,
  permissioned,
  compact,
}: ProofSystemCellProps) {
  const secondLine =
    permissioned !== undefined
      ? permissioned
        ? 'Permissioned'
        : 'Permissionless'
      : proofSystem?.name && !hideType
        ? proofSystem.name
        : undefined
  const zkCatalogIds = proofSystem?.zkCatalogIds ?? []
  return (
    <TableLink
      href={
        !proofSystem?.type
          ? undefined
          : zkCatalogIds.length > 0
            ? `/zk-catalog?highlight=${zkCatalogIds.join(',')}`
            : `/layer2s/projects/${slug}#state-validation`
      }
    >
      <TwoRowCell>
        <TwoRowCell.First>
          {hideType && proofSystem?.name ? (
            <TypeInfo stacks={stacks} compact={compact}>
              {proofSystem.name}
            </TypeInfo>
          ) : (
            <TypeInfo stacks={stacks} compact={compact}>
              {proofSystem?.type ?? 'None'}
            </TypeInfo>
          )}
        </TwoRowCell.First>
        {secondLine && !compact && (
          <TwoRowCell.Second>{secondLine}</TwoRowCell.Second>
        )}
      </TwoRowCell>
    </TableLink>
  )
}
