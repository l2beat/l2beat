import { ProjectId } from '@l2beat/shared-pure'

export interface TokenFrameworkDefinition {
  id: string
  label: string
  projectId: ProjectId
  color: string
}

export const TOKEN_FRAMEWORKS: TokenFrameworkDefinition[] = [
  {
    id: 'oft',
    label: 'OFT',
    projectId: ProjectId('layerzero'),
    color: '#7B61FF',
  },
  { id: 'cct', label: 'CCT', projectId: ProjectId('ccip'), color: '#2A5ADA' },
  {
    id: 'warp',
    label: 'Warp',
    projectId: ProjectId('hyperlane-hwr'),
    color: '#E64980',
  },
  {
    id: 'ntt',
    label: 'NTT',
    projectId: ProjectId('wormhole-ntt'),
    color: '#22C55E',
  },
  {
    id: 'its',
    label: 'ITS',
    projectId: ProjectId('axelar-its'),
    color: '#F59E0B',
  },
]
