import { ProjectId } from '@l2beat/types'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity-v2/BlockTransactionCountRepository'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'

export function createBlockTransactionCounter(
  projectId: ProjectId,
  processor: SequenceProcessor,
  blockRepository: BlockTransactionCountRepository,
): TransactionCounter {
  return new TransactionCounter(projectId, processor, () =>
    blockRepository.getLastTimestampByProjectId(projectId),
  )
}
