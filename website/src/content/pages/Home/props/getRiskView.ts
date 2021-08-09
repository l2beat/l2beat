import { Project } from '@l2beat/config'
import {
  RiskViewEntry,
  RiskViewItem,
  RiskViewProps,
} from '../view/RiskView/RiskView'

export function getRiskView(projects: Project[]): RiskViewProps {
  return { items: projects.map(getRiskViewEntry) }
}

export function getRiskViewEntry(project: Project): RiskViewEntry {
  return {
    name: project.name,
    slug: project.slug,
    stateCorrectness: STATE_CORRECTNESS[project.slug],
    dataAvailability: DATA_AVAILABILITY[project.slug],
    upgradeability: UPGRADEABILITY[project.slug],
    owner: OWNER[project.slug],
    escapeHatch: ESCAPE_HATCH[project.slug],
  }
}

const STATE_CORRECTNESS: Record<string, RiskViewItem> = {
  loopring: { value: 'ZK-SNARK proofs' },
  nahmii: { value: 'Fraud proofs' },
  optimism: { value: 'Fraud proofs' },
  dydx: { value: 'ZK-STARK proofs' },
  zkswap: { value: 'ZK-SNARK proofs' },
  deversifi: { value: 'ZK-STARK proofs' },
  zksync: { value: 'ZK-SNARK proofs' },
  sorare: { value: 'ZK-STARK proofs' },
  omgnetwork: { value: 'Fraud proofs' },
  leverj: { value: 'Fraud proofs' },
  habitat: { value: 'Fraud proofs' },
  immutablex: { value: 'ZK-STARK proofs' },
  aztec: { value: 'ZK-SNARK proofs' },
  hermez: { value: 'ZK-SNARK proofs' },
  arbitrum: { value: 'Fraud proofs' },
  layer2finance: { value: 'Fraud proofs' },
  fuel: { value: 'Fraud proofs' },
}

const DATA_AVAILABILITY: Record<string, RiskViewItem> = {
  loopring: { value: 'On chain', sentiment: 'good' },
  nahmii: { value: 'External', sentiment: 'bad' },
  optimism: { value: 'On chain', sentiment: 'good' },
  dydx: { value: 'On chain', sentiment: 'good' },
  zkswap: { value: 'Mixed', sentiment: 'neutral' },
  deversifi: { value: 'External', sentiment: 'bad' },
  zksync: { value: 'On chain', sentiment: 'good' },
  sorare: { value: 'External', sentiment: 'bad' },
  omgnetwork: { value: 'External', sentiment: 'bad' },
  leverj: { value: 'On chain', sentiment: 'good' },
  habitat: { value: 'On chain', sentiment: 'good' },
  immutablex: { value: 'External', sentiment: 'bad' },
  aztec: { value: 'On chain', sentiment: 'good' },
  hermez: { value: 'On chain', sentiment: 'good' },
  arbitrum: { value: 'On chain', sentiment: 'good' },
  layer2finance: { value: 'On chain', sentiment: 'good' },
  fuel: { value: 'On chain', sentiment: 'good' },
}

const UPGRADEABILITY: Record<string, RiskViewItem> = {
  loopring: { value: 'Upgradable', sentiment: 'bad' },
  nahmii: { value: 'Unknown', sentiment: 'unknown' },
  optimism: { value: 'Upgradable', sentiment: 'bad' },
  dydx: { value: 'Upgradable', sentiment: 'bad' },
  zkswap: { value: '2 week delay', sentiment: 'neutral' },
  deversifi: { value: '4 week delay', sentiment: 'neutral' },
  zksync: { value: '2 week delay', sentiment: 'neutral' },
  sorare: { value: 'Unknown', sentiment: 'unknown' },
  omgnetwork: { value: 'Upgradable', sentiment: 'bad' },
  leverj: { value: 'Unknown', sentiment: 'unknown' },
  habitat: { value: 'Unknown', sentiment: 'unknown' },
  immutablex: { value: 'Upgradable', sentiment: 'bad' },
  aztec: { value: 'Upgradable', sentiment: 'bad' },
  hermez: { value: 'Upgradable', sentiment: 'bad' },
  arbitrum: { value: 'Upgradable', sentiment: 'bad' },
  layer2finance: { value: 'Unknown', sentiment: 'unknown' },
  fuel: { value: 'Immutable', sentiment: 'good' },
}

const OWNER: Record<string, RiskViewItem> = {
  loopring: { value: 'Multisig', sentiment: 'neutral' },
  nahmii: { value: 'Unknown', sentiment: 'unknown' },
  optimism: { value: 'Multisig', sentiment: 'neutral' },
  dydx: { value: 'Unknown', sentiment: 'unknown' },
  zkswap: { value: 'Multisig', sentiment: 'neutral' },
  deversifi: { value: 'Unknown', sentiment: 'unknown' },
  zksync: { value: 'Multisig', sentiment: 'neutral' },
  sorare: { value: 'Unknown', sentiment: 'unknown' },
  omgnetwork: { value: 'Unknown', sentiment: 'unknown' },
  leverj: { value: 'Unknown', sentiment: 'unknown' },
  habitat: { value: 'Unknown', sentiment: 'unknown' },
  immutablex: { value: 'Unknown', sentiment: 'unknown' },
  aztec: { value: 'Multisig', sentiment: 'neutral' },
  hermez: { value: 'Unknown', sentiment: 'unknown' },
  arbitrum: { value: 'EOA', sentiment: 'bad' },
  layer2finance: { value: 'Multisig', sentiment: 'neutral' },
  fuel: { value: 'Unowned', sentiment: 'good' },
}

const ESCAPE_HATCH: Record<string, RiskViewItem> = {
  loopring: { value: 'Unknown', sentiment: 'unknown' },
  nahmii: { value: 'Unknown', sentiment: 'unknown' },
  optimism: { value: 'Merkle Proof', sentiment: 'good' },
  dydx: { value: 'Merkle Proof', sentiment: 'good' },
  zkswap: { value: 'ZK Proof', sentiment: 'neutral' },
  deversifi: { value: 'Merkle Proof', sentiment: 'good' },
  zksync: { value: 'ZK Proof', sentiment: 'neutral' },
  sorare: { value: 'Merkle Proof', sentiment: 'good' },
  omgnetwork: { value: 'Unknown', sentiment: 'unknown' },
  leverj: { value: 'Unknown', sentiment: 'unknown' },
  habitat: { value: 'Unknown', sentiment: 'unknown' },
  immutablex: { value: 'Merkle Proof', sentiment: 'good' },
  aztec: { value: 'Merkle Proof', sentiment: 'good' },
  hermez: { value: 'Unknown', sentiment: 'unknown' },
  arbitrum: { value: 'Merkle Proof', sentiment: 'good' },
  layer2finance: { value: 'Unknown', sentiment: 'unknown' },
  fuel: { value: 'Unknown', sentiment: 'unknown' },
}
