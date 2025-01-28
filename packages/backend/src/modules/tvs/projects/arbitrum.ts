import { layer2ToBackendProject } from '@l2beat/backend-shared'
import { layer2s } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { mapConfig } from '../mapConfig'

const arbitrum = layer2s.find((l) => l.id === ProjectId('arbitrum'))
assert(arbitrum, 'Arbitrum not found')
assert(arbitrum.chainConfig, 'Arbitrum chain config not defined')
const backendProject = layer2ToBackendProject(arbitrum)

export const arbitrumConfig = mapConfig(backendProject, arbitrum.chainConfig)
