import { ProjectId } from '@l2beat/shared-pure'

import { Layer2 } from '../../layer2s'

export interface Layer3 extends Layer2 {
  isLayer3: boolean
  hostChain: ProjectId
}
