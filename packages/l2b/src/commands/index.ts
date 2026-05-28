import { AddShape } from './AddShape'
import { AdriansCommand } from './AdriansCommand'
import { BlobSenders } from './BlobSenders'
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
import { FlattenerValidator } from './FlattenerValidator'
import { GenerateEntrypoints } from './GenerateEntrypoints'
import { GetConfig } from './GetConfig'
import { GetStakeDistrib } from './GetStakeDistrib'
import { GetTokenMinters } from './GetTokenMinters'
import { Init } from './Init'
import { InitTemplate } from './InitTemplate'
import { Inspect } from './Inspect'
import { Leaks } from './Leaks'
import { MatchFlat } from './MatchFlat'
import { Minters } from './Minters'
import { ModelPermissions } from './ModelPermissions'
import { OPConfigs } from './OPConfigs'
import { DetectProxy } from './Proxy'
import { RefreshDiscovery } from './RefreshDiscovery'
import { RegenerateShapeHashes } from './RegenerateShapeHashes'
import { ScanKintoAm } from './ScanKintoAm'
import { ShowPermissions } from './ShowPermissions'
import { SolFmt } from './SolFmt'
import { StarknetAccessControl } from './StarknetAccessControl'
import { StarknetProgramHashes } from './StarknetProgramHashes'
import { TVL } from './TVL'
import { UI } from './UI'
import { Why } from './Why'
import { ZkGovProposal } from './ZkGovProposal'

export function getSubcommands() {
  return [
    AddShape,
    AdriansCommand,
    BlobSenders,
    CheckRpc,
    Colorize,
    CompareFlatSources,
    CompareOpStacks,
    CompareOrbitStacks,
    CountUserOperations,
    DecodeEigenDACommitment,
    DeploymentTimestamp,
    DetectProxy,
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
    FlattenerValidator,
    GenerateEntrypoints,
    GetConfig,
    GetStakeDistrib,
    GetTokenMinters,
    Init,
    InitTemplate,
    Inspect,
    Leaks,
    MatchFlat,
    Minters,
    ModelPermissions,
    OPConfigs,
    RefreshDiscovery,
    RegenerateShapeHashes,
    ScanKintoAm,
    ShowPermissions,
    SolFmt,
    StarknetAccessControl,
    StarknetProgramHashes,
    TVL,
    UI,
    Why,
    ZkGovProposal,
  ]
}
