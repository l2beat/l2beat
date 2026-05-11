import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('layerzero')

export const layerzero: BaseProject = {
  id: ProjectId('layerzero'),
  slug: 'layerzero',
  name: 'LayerZero',
  shortName: undefined,
  addedAt: UnixTime(1769421770),
  interopConfig: {
    description:
      'LayerZero OFT (omnichain fungible token) is a multichain token framework built on the modular, highly customizable LayerZero messaging protocol. It is validated by multisig-like smart contracts called DVNs and supports a vast set of EVM and non-EVM destinations.',
    detailedDescription: `
# Architecture
LayerZero deploys a single \`Endpoint\` contract on each supported chain. This contract serves as the chain-central registry for omnichain apps (*OApp*s) and their *owners* and *delegates*. An *Oapp* is a smart contract that interacts with the LayerZero protocol through a standardized messaging interface. The most popular OApp flavor is the omnichain fungible token (*OFT*) standard, which enables the transport of tokens across LayerZero-supported chains. Token owners can deploy *OFT Adapter* smart contracts (*OApps* themselves) that connect traditional tokens to the LayerZero protocol. New tokens can be directly bound to LayerZero by deploying them as a native *OFT* smart contract, which is automatically an OApp on LayerZero.


# Crosschain oracle and validation
The modular LayerZero messaging protocol supports any smart contract logic as its validation mechanism. In practice and by default, multisignature wallets and EOAs validate and deliver crosschain messages, called *packets* in LZ terms. *OApp owner* addresses or their onchain *delegates* can override the default security config for their OApp in each local \`Endpoint\` contract. Each library or setting that is not explicitly configured falls back to the default config. Security configs consist of a validation library (smart contract) and its various settings (like the actual validating multisigs and their threshold) and importantly can be set **on each chain separately** and then **for each *peer* chain from/to that chain**. For example, a single OFT that is live on 20 chains can have 20x20=400 security configs, counting incoming configs only. A misconfiguration or exploit in any single one of those 400 validation configs can compromise the example OFT.

# Upgradeability
Core protocol contract code forms a framework that points at security-critical contracts. Although the core framework contract code is immutable, the security config and its implementation contracts can be changed by permissioned actors like the LayerZero team and the *OApp* owners, which effectively results in system upgrades. Application-level contracts like OApps have custom upgradeability.

# Monitoring
LayerZero provides a [block explorer](https://layerzeroscan.com/) which is mostly intended for users and researchers tracking crosschain transactions and for aggregate metrics. There is currently security or monitoring related tooling for OApp owners like global OFT accounting or global security config tracking.
`,
    isAggregate: true,
    plugins: [
      {
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'lockAndMint',
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
