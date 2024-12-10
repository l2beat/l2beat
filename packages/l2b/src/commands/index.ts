import { CheckRpc } from './CheckRpc'
import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { CountUserOperations } from './CountUserOperations'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { Events } from './Events'
import { FetchFlatSources } from './FetchFlatSources'
import { FindL2 } from './FindL2'
import { Flatten } from './Flatten'
import { FlattenAndDiff } from './FlattenAndDiff'
import { MatchFlat } from './MatchFlat'
import { Powerdiff } from './Powerdiff'
import { DetectProxy } from './Proxy'
import { SolFmt } from './SolFmt'
import { StarknetProgramHashes } from './StarknetProgramHashes'
import { Init } from './Init'
import { TVL } from './TVL'
import { UI } from './UI'

export function getSubcommands() {
  return [
    CheckRpc,
    CompareFlatSources,
    CompareOpStacks,
    CompareOrbitStacks,
    CountUserOperations,
    DeploymentTimestamp,
    DetectProxy,
    Events,
    FetchFlatSources,
    Flatten,
    FlattenAndDiff,
    MatchFlat,
    Powerdiff,
    SolFmt,
    StarknetProgramHashes,
    FindL2,
    Init,
    TVL,
    UI,
  ]
}
