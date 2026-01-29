/**
 * Scroll Stack Configuration
 *
 * Scroll uses a multi-layer governance with:
 * - Scroll Security Council
 * - Multiple Timelocks (Fast, Emergency, SC Emergency, SC Slow)
 * - ScrollOwner access control
 * - ProxyAdmin
 */

import type { ChainInfo } from './registry'
import type { StackConfig } from './types'

// Scroll governance addresses
const SCROLL_GOVERNANCE = [
  // Core admin contracts
  'eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072', // ProxyAdmin
  'eth:0x798576400F7D662961BA15C6b3F3d813447a26a6', // ScrollOwner
  // Timelocks
  'eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd', // TimelockSCSlow
  'eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44', // TimelockSCEmergency
  'eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4', // TimelockFast
  'eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b', // TimelockEmergency
  // Multisigs
  'eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD', // Scroll Security Council
  'eth:0x40bD67b02EBf1CFB4AdA7F60CabAc94d6aafc6eE', // Scroll Security Council Minority
  'eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f', // Scroll Multisig 1
  'eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc', // Scroll Multisig 2
  'eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe', // Scroll Multisig 3
  'eth:0x8FA3b4570B4C96f8036C13b64971BA65867eEB48', // Scroll Multisig 4
]

/**
 * Get Scroll stack configuration
 */
export function getScrollConfig(chainInfo: ChainInfo): StackConfig {
  return {
    projectId: chainInfo.projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins: SCROLL_GOVERNANCE,
    rollupAdminName: 'Scroll Governance',
    escrows: [],
    autoDetect: true,
  }
}

/**
 * Check if an address is a known Scroll governance address
 */
export function isScrollGovernance(address: string): boolean {
  const normalized = address.toLowerCase()
  return SCROLL_GOVERNANCE.some(
    (admin) => admin.toLowerCase() === normalized || admin.toLowerCase().endsWith(normalized)
  )
}
