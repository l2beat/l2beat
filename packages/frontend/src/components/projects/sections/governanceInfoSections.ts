import type { ProjectGovernanceInfo } from '@l2beat/config'

/** Display order and titles of the governance profile tables, shared by the section and its markdown. */
export const GOVERNANCE_INFO_SECTIONS: {
  key: keyof ProjectGovernanceInfo
  title: string
}[] = [
  { key: 'securityCouncil', title: 'Security Council' },
  { key: 'guardians', title: 'Guardians' },
  { key: 'upgrades', title: 'Upgrades' },
  { key: 'tokenGovernance', title: 'Token governance' },
]
