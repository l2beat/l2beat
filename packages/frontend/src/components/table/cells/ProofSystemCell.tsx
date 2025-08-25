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
}

export function ProofSystemCell({
  proofSystem,
  slug,
  stacks,
}: ProofSystemCellProps) {
  return (
    <TableLink
      href={
        !proofSystem?.type
          ? undefined
          : proofSystem?.zkCatalogId
            ? `/zk-catalog?highlight=${proofSystem?.zkCatalogId}`
            : `/scaling/projects/${slug}#state-validation`
      }
    >
      <TwoRowCell>
        <TwoRowCell.First>
          <TypeInfo stacks={stacks}>{proofSystem?.type ?? 'None'}</TypeInfo>
        </TwoRowCell.First>
        {proofSystem?.name && (
          <TwoRowCell.Second>{proofSystem?.name}</TwoRowCell.Second>
        )}
      </TwoRowCell>
    </TableLink>
  )
}
