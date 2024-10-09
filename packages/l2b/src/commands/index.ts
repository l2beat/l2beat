import { CheckRpc } from './CheckRpc'
import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { CountUserOperations } from './CountUserOperations'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { Events } from './Events'
import { FetchFlatSources } from './FetchFlatSources'
import { Flatten } from './Flatten'
import { FlattenAndDiff } from './FlattenAndDiff'
import { MatchFlat } from './MatchFlat'
import { Powerdiff } from './Powerdiff'
import { DetectProxy } from './Proxy'
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
    MatchFlat,
    FlattenAndDiff,
    Flatten,
    Powerdiff,
    SolFmt,
    FetchFlatSources,
    TVL,
    Events,
    DetectProxy,
    StarknetProgramHashes,
  ]
}
