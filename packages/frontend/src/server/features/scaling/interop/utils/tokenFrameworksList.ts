import { ProjectId } from '@l2beat/shared-pure'

export interface TokenFrameworkDefinition {
  id: string
  label: string
  projectId: ProjectId
}

export const TOKEN_FRAMEWORKS: TokenFrameworkDefinition[] = [
  { id: 'oft', label: 'OFT', projectId: ProjectId('layerzero') },
  { id: 'cct', label: 'CCT', projectId: ProjectId('ccip') },
  { id: 'warp', label: 'Warp', projectId: ProjectId('hyperlane-hwr') },
  { id: 'ntt', label: 'NTT', projectId: ProjectId('wormhole-ntt') },
  { id: 'its', label: 'ITS', projectId: ProjectId('axelar-its') },
]
