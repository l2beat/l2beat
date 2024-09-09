import { CheckRpc } from './CheckRpc'
import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { CountUserOperations } from './CountUserOperations'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { FetchFlatSources } from './FetchFlatSources'
import { Flatten } from './Flatten'
import { FlattenAndDiff } from './FlattenAndDiff'
import { Powerdiff } from './Powerdiff'
import { SolFmt } from './SolFmt'
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
    SolFmt,
    FetchFlatSources,
    TVL,
    StarknetProgramHashes,
  ]
}
