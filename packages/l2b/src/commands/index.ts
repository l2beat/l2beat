import { AddShape } from './AddShape'
import { AdriansCommand } from './AdriansCommand'
import { CheckRpc } from './CheckRpc'
import { Colorize } from './Colorize'
import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { CountUserOperations } from './CountUserOperations'
import { DecodeEigenDACommitment } from './DecodeEigenDACommitment'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { Discover } from './Discover'
import { DownloadAllShapes, DownloadShapes } from './DownloadShapes'
import { Events } from './Events'
import { FetchAgglayer } from './FetchAggLayer'
import { FetchDiscoveryCache } from './FetchDiscoveryCache'
import { FetchFlatSources } from './FetchFlatSources'
import { FetchZkStack } from './FetchZkStack'
import { FindCelestiaNamespace } from './FindCelestiaNamespace'
import { FindL2 } from './FindL2'
import { FindUnusedShapes } from './FindUnusedShapes'
import { FixDiscoverySchemaPaths } from './FixDiscoverySchemaPaths'
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
import { StarknetAccessControl } from './StarknetAccessControl'
import { StarknetProgramHashes } from './StarknetProgramHashes'
import { TVL } from './TVL'
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
    DecodeEigenDACommitment,
    Discover,
    DownloadAllShapes,
    DownloadShapes,
    Events,
    FetchAgglayer,
    FetchDiscoveryCache,
    FetchFlatSources,
    FetchZkStack,
    FindCelestiaNamespace,
    FindL2,
    FindUnusedShapes,
    FixDiscoverySchemaPaths,
    Flatten,
    FlattenAndDiff,
    GetTokenMinters,
    Init,
    InitTemplate,
    MatchFlat,
    ModelPermissions,
    OPConfigs,
    Powerdiff,
    RefreshDiscovery,
    ScanKintoAm,
    SolFmt,
    StarknetAccessControl,
    StarknetProgramHashes,
    TVL,
    UI,
    ZkGovProposal,
  ]
}
