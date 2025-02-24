import { AdriansCommand } from './AdriansCommand'
import { CheckRpc } from './CheckRpc'
import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { CountUserOperations } from './CountUserOperations'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { Discover } from './Discover'
import { Events } from './Events'
import { FetchFlatSources } from './FetchFlatSources'
import { FindL2 } from './FindL2'
import { Flatten } from './Flatten'
import { FlattenAndDiff } from './FlattenAndDiff'
import { GetTokenMinters } from './GetTokenMinters'
import { Init } from './Init'
import { InitTemplate } from './InitTemplate'
import { MatchFlat } from './MatchFlat'
import { OPConfigs } from './OPConfigs'
import { Powerdiff } from './Powerdiff'
import { DetectProxy } from './Proxy'
import { RefreshDiscovery } from './RefreshDiscovery'
import { SolFmt } from './SolFmt'
import { StarknetProgramHashes } from './StarknetProgramHashes'
import { TVL } from './TVL'
import { UI } from './UI'

export function getSubcommands() {
  return [
    AdriansCommand,
    CheckRpc,
    CompareFlatSources,
    CompareOpStacks,
    CompareOrbitStacks,
    CountUserOperations,
    DeploymentTimestamp,
    DetectProxy,
    Discover,
    Events,
    FetchFlatSources,
    Flatten,
    FlattenAndDiff,
    GetTokenMinters,
    MatchFlat,
    OPConfigs,
    Powerdiff,
    RefreshDiscovery,
    SolFmt,
    StarknetProgramHashes,
    FindL2,
    Init,
    InitTemplate,
    TVL,
    UI,
  ]
}
