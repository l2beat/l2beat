import { CheckRpc } from './CheckRpc'
import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { CountUserOperations } from './CountUserOperations'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { Flatten } from './Flatten'
import { FlattenAndDiff } from './FlattenAndDiff'
import { Powerdiff } from './Powerdiff'
import { StarknetProgramHashes } from './StarknetProgramHashes'
import { TVL } from './TVL'

export function getSubcommands() {
  return [
    CompareFlatSources,
    CompareOpStacks,
    CompareOrbitStacks,
    CountUserOperations,
    CheckRpc,
    DeploymentTimestamp,
    FlattenAndDiff,
    Flatten,
    Powerdiff,
    TVL,
    StarknetProgramHashes,
  ]
}
