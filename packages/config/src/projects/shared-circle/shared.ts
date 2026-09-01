import { formatSeconds } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('shared-circle')

const cctpV1AttesterThreshold = discovery.getContractValue<number>(
  'MessageTransmitter',
  'signatureThreshold',
)
const cctpV1AttesterCount = discovery.getContractValue<number>(
  'MessageTransmitter',
  'getNumEnabledAttesters',
)
const cctpV2AttesterThreshold = discovery.getContractValue<number>(
  'MessageTransmitterV2',
  'signatureThreshold',
)
const cctpV2AttesterCount = discovery.getContractValue<number>(
  'MessageTransmitterV2',
  'getNumEnabledAttesters',
)
const gatewayWithdrawalDelayBlocks = discovery.getContractValue<number>(
  'GatewayWallet',
  'withdrawalDelay',
)
const gatewayWithdrawalDelayTime = `${formatSeconds(
  gatewayWithdrawalDelayBlocks * 12,
  { fullUnit: true },
)} (${gatewayWithdrawalDelayBlocks} blocks at 12-second block time)`
const gatewayWalletSignerCount = discovery.getContractValue<string[]>(
  'GatewayWallet',
  'attestationSigners',
).length
const gatewayMinterSignerCount = discovery.getContractValue<string[]>(
  'GatewayMinter',
  'attestationSigners',
).length

export const CIRCLE_DISCOVERY_SECTIONS = {
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}

export const CCTP_DETAILED_DESCRIPTION = readProjectMarkdown(
  'shared-circle',
  'cctpDetailedDescription',
  {
    cctpV1AttesterThreshold,
    cctpV1AttesterCount,
    cctpV2AttesterThreshold,
    cctpV2AttesterCount,
  },
)

export const CIRCLE_GATEWAY_DETAILED_DESCRIPTION = readProjectMarkdown(
  'shared-circle',
  'circleGatewayDetailedDescription',
  {
    gatewayWalletSignerCount,
    gatewayMinterSignerCount,
    gatewayWithdrawalDelayTime,
  },
)
