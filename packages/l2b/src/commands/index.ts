import { AddShape } from './AddShape'
import { AdriansCommand } from './AdriansCommand'
import { CheckRpc } from './CheckRpc'
import { Colorize } from './Colorize'
import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { CountUserOperations } from './CountUserOperations'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { Discover } from './Discover'
import { DownloadShapes } from './DownloadShapes'
import { Events } from './Events'
import { FetchAgglayer } from './FetchAggLayer'
import { FetchFlatSources } from './FetchFlatSources'
import { FetchZkStack } from './FetchZkStack'
import { FindCelestiaNamespace } from './FindCelestiaNamespace'
import { FindL2 } from './FindL2'
import { Flatten } from './Flatten'
import { FlattenAndDiff } from './FlattenAndDiff'
import { GetTokenMinters } from './GetTokenMinters'
import { Init } from './Init'
import { InitTemplate } from './InitTemplate'
import { MatchFlat } from './MatchFlat'
import { ModelPermissions } from './ModelPermissions'
import { OPConfigs } from './OPConfigs'
import { Powerdiff } from './Powerdiff'
import { DetectProxy } from './Proxy'
import { RefreshDiscovery } from './RefreshDiscovery'
import { ScanKintoAm } from './ScanKintoAm'
import { SolFmt } from './SolFmt'
import { StarknetProgramHashes } from './StarknetProgramHashes'
import { TVL } from './TVL'
import { TokenScreening } from './TokenScreening'
import { UI } from './UI'
import { ZkGovProposal } from './ZkGovProposal'

export function getSubcommands() {
  return [
    AddShape,
    AdriansCommand,
    CheckRpc,
    Colorize,
    CompareFlatSources,
    CompareOpStacks,
    CompareOrbitStacks,
    CountUserOperations,
    DeploymentTimestamp,
    DetectProxy,
    DownloadShapes,
    Discover,
    Events,
    FetchFlatSources,
    Flatten,
    FlattenAndDiff,
    FindCelestiaNamespace,
    GetTokenMinters,
    MatchFlat,
    ModelPermissions,
    OPConfigs,
    Powerdiff,
    RefreshDiscovery,
    ScanKintoAm,
    SolFmt,
    StarknetProgramHashes,
    FetchAgglayer,
    FetchZkStack,
    FindL2,
    Init,
    InitTemplate,
    TVL,
    TokenScreening,
    UI,
    ZkGovProposal,
  ]
}
