import {
  assert,
  ChainSpecificAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('ccip')

const ocrCommitN = discovery.getContractValue(
  'EthereumOffRamp_v1_6',
  'ocrCommitN',
)
const ocrCommitF = discovery.getContractValue(
  'EthereumOffRamp_v1_6',
  'ocrCommitF',
)
const ocrCommitQuorum = Number(ocrCommitF) + 1

const permissionLessExecutionThresholdFmt = discovery.getContractValue(
  'EthereumOffRamp_v1_6',
  'permissionLessExecutionThresholdFmt',
)

type V2Route = {
  defaultCCVs: string[]
  laneMandatedCCVs: string[]
}
const v2DestRoutes = discovery.getContractValue<Record<string, V2Route>>(
  'EthereumOnRamp_v2_0',
  'destChainConfigs',
)
const v2SourceRoutes = discovery.getContractValue<Record<string, V2Route>>(
  'EthereumOffRamp_v2_0',
  'sourceChainConfigs',
)
const v2Routes = [
  ...Object.values(v2DestRoutes),
  ...Object.values(v2SourceRoutes),
]
const v2DefaultCCVs = new Set(v2Routes.flatMap((r) => r.defaultCCVs))
assert(
  v2Routes.every(
    (r) => r.laneMandatedCCVs.length === 0 && r.defaultCCVs.length === 1,
  ) && v2DefaultCCVs.size === 1,
  'ccip: a v2 route has lane-mandated CCVs or its own default CCV, update detailedDescription.md',
)
const v2Chains = Object.keys(v2SourceRoutes)
assert(
  v2Chains.length === Object.keys(v2DestRoutes).length &&
    v2Chains.every((chain) => chain in v2DestRoutes),
  'ccip: v2 OnRamp and OffRamp route to different chains, update detailedDescription.md',
)
// the description names the shared default CCV the CommitteeVerifier resolver
const committeeVerifier = discovery.getContract('CommitteeVerifier').address
const defaultCCV = [...v2DefaultCCVs][0]
// both directions must resolve, and only to the CommitteeVerifier
const defaultCCVVerifiers = [
  'getAllInboundImplementations',
  'getAllOutboundImplementations',
].map((field) =>
  discovery
    .getContractValue<{ verifier: string }[]>(defaultCCV, field)
    .map((i) => i.verifier),
)
assert(
  discovery.getContract(defaultCCV).template ===
    'ccip/VersionedVerifierResolver' &&
    defaultCCVVerifiers.every(
      (verifiers) =>
        verifiers.length > 0 && verifiers.every((v) => v === committeeVerifier),
    ),
  'ccip: the shared default CCV is not the CommitteeVerifier resolver, update detailedDescription.md',
)

const committeeConfigs = Object.values(
  discovery.getContractValue<
    Record<string, { threshold: number; signers: string[] }>
  >('CommitteeVerifier', 'signatureConfigs'),
)
const committeeThresholds = new Set(committeeConfigs.map((c) => c.threshold))
assert(
  committeeThresholds.size === 1,
  'ccip: CommitteeVerifier thresholds differ per source chain, update detailedDescription.md',
)
const committeeSignerCount = mostCommon(
  committeeConfigs.map((c) => c.signers.length),
)

const usdcMechanisms = Object.values(
  discovery.getContractValue<Record<string, string>>(
    'USDCTokenPoolProxy',
    'lockOrBurnMechanisms',
  ),
)
assert(
  usdcMechanisms.every((m) => ['CCV', 'LOCK_RELEASE', 'CCTP_V1'].includes(m)),
  'ccip: a USDC route uses another child pool, update detailedDescription.md',
)
const usdcRoutes = (mechanism: string) =>
  String(usdcMechanisms.filter((m) => m === mechanism).length)

const rmnCallers = discovery.getContractValue<string[]>(
  'RMN',
  'getAllAuthorizedCallers',
)
const rmnCurseTimelock = discovery.getContract('RMN_CurseTimelock').address
assert(
  rmnCallers.length === 2 &&
    rmnCallers.includes(rmnCurseTimelock) &&
    rmnCallers
      .filter((c) => c !== rmnCurseTimelock)
      .every((c) => discovery.isEOA(ChainSpecificAddress(c))),
  'ccip: RMN authorized callers are no longer the curse timelock and an EOA, update detailedDescription.md',
)
const cursedSubjects = discovery.getContractValue<string[]>(
  'RMN',
  'cursedSubjects',
)
const currentCurses = cursedSubjects.includes('GLOBAL_CURSE')
  ? ' It currently applies a global curse.'
  : cursedSubjects.length > 0
    ? ` It currently curses the paths of ${cursedSubjects.length} chains: ${cursedSubjects.join(', ')}.`
    : ''

function mostCommon(values: number[]): number {
  const counts = new Map<number, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

export const ccip: BaseProject = {
  id: ProjectId('ccip'),
  slug: 'ccip',
  name: 'Chainlink CCIP',
  shortName: 'CCIP',
  addedAt: UnixTime(1769526436),
  discoveryInfo: getDiscoveryInfo([discovery]),
  interopConfig: {
    description:
      "Multichain token framework using the CCIP messaging protocol. Routes are migrating from v1.6's fixed OCR commit and execution networks to v2.0's modular cross-chain verifiers and permissionless execution.",
    detailedDescription: readProjectMarkdown('ccip', 'detailedDescription', {
      ocrCommitQuorum,
      ocrCommitN: String(ocrCommitN),
      permissionLessExecutionThresholdFmt: String(
        permissionLessExecutionThresholdFmt,
      ),
      v2ChainCount: String(v2Chains.length),
      committeeThreshold: String([...committeeThresholds][0]),
      committeeSignerCount: String(committeeSignerCount),
      usdcCcvRoutes: usdcRoutes('CCV'),
      usdcLockReleaseRoutes: usdcRoutes('LOCK_RELEASE'),
      usdcCctpV1Routes: usdcRoutes('CCTP_V1'),
      currentCurses,
    }),
    plugins: [
      {
        plugin: 'ccip',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'ccip',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'ccip',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'multichain',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
