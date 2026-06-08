import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'

const discovery = new ProjectDiscovery('cctp')

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

export const CCTP_DETAILED_DESCRIPTION = `
# Architecture
Circle's Cross-Chain Transfer Protocol (CCTP) is a centralized burn-and-mint bridge for USDC and, underneath it, a generalized message-passing protocol. A source-chain \`TokenMessenger\` burns USDC through the local \`TokenMinter\` and asks the \`MessageTransmitter\` to emit a message for the destination domain. Circle's offchain Iris attestation service observes the source transaction and acts as the oracle / attester at the destination. Anyone with the message and attestation can call \`receiveMessage\` on the destination \`MessageTransmitter\`; the contract verifies the attester signatures, prevents nonce replay, dispatches the message to the destination \`TokenMessenger\`, and mints the same amount of native USDC to the requested recipient.

# CCTP v1 and v2
CCTP v1 and v2 use the same high-level flow and both can carry arbitrary message bodies. In the Ethereum discovery, v1's \`MessageTransmitter\` and \`TokenMessenger\` are immutable contracts. [CCTP v1](https://developers.circle.com/cctp/v1) only supports 'Standard Transfer': Circle waits for a certain amount of block confirmations on the source chain before attesting.

CCTP v2 uses \`MessageTransmitterV2\` and \`TokenMessengerV2\`, adds finality thresholds, destination mint fees, and optional hook data. The new 'Fast Transfer' feature lets Iris attest much faster as long as Circle's global 'Fast Transfer' allowance is available. Hooks are metadata passed with the burn message and are interpreted by app-level integrators rather than executed by CCTP core.

# Crosschain oracle and validation
CCTP does not validate source-chain state on the destination chain. The destination \`MessageTransmitter\` verifies signatures from Circle-controlled attesters, so security depends on Circle's offchain attestation service signing only valid source messages and protecting its signing keys. CCTP v1 is configured with a ${cctpV1AttesterThreshold}/${cctpV1AttesterCount} attester threshold, while v2 is configured with a ${cctpV2AttesterThreshold}/${cctpV2AttesterCount} threshold. The attester manager can change enabled attesters and thresholds, and the owner can change the attester manager.

# Upgradeability
The v1 Ethereum contracts in discovery are immutable, but critical permissions like ownership, minters, pausing, rescuer, token-controller, and attester-manager roles govern protocol operation. V2 introduces proxied contracts; their proxy admins can replace implementations with no onchain delay. CCTP is deployed per Circle domain, so a complete risk assessment must include the corresponding contracts, signer configuration, and permissions on every supported source and destination chain.
`

export const CIRCLE_GATEWAY_DETAILED_DESCRIPTION = `
# Architecture
[Circle Gateway](https://developers.circle.com/gateway) is a chain-abstraction layer for USDC: users deposit native USDC into \`GatewayWallet\` contracts on supported source chains and Circle's Gateway system tracks those deposits as an offchain unified balance. The user can spend against the aggregate balance on any supported destination chain.

# Crosschain Oracle and validation
A user deposits through \`GatewayWallet\`. To spend the unified balance, the user signs one or more \`BurnIntent\` payloads specifying source and destination domains, token, recipient, amount, fee cap, expiry, and optional hook data. On the destination chain, anyone can call \`GatewayMinter.gatewayMint\` with the attestation payload and a signature from a configured Gateway attestation signer; \`GatewayMinter\` mints USDC to the destination recipient. On the source chain, \`GatewayWallet\` validates the signed burn intent, deducts the user's available or withdrawing balance, collects fees, and burns the corresponding USDC (this happens after the mint at the destination!). The Ethereum \`GatewayWallet\` and \`GatewayMinter\` use ${gatewayWalletSignerCount} burn signer on \`GatewayWallet\` and ${gatewayMinterSignerCount} attestation signer on \`GatewayMinter\`.

# Withdrawal self-service
If the Circle API is unavailable, users can use an onchain two-step withdrawal path; on Ethereum the discovered \`withdrawalDelay\` is ${gatewayWithdrawalDelayTime}. This delay gives the Gateway system time to burn funds that may already have been minted elsewhere before the withdrawal completes.

# Upgradeability
Both Gateway contracts are proxies with owner/admin, pauser, denylister, signer-management, fee-recipient, and token-support roles; upgrade admins on Ethereum can replace implementations with no onchain delay.

# Monitoring
Circle does not provide a block explorer. There currently is no security, transparency or monitoring related tooling for CCTP or Gateway users.
`
