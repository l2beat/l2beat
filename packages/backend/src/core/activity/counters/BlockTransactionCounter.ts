import { ProjectId } from '@l2beat/shared-pure'

import { BlockTransactionCountRepository } from '../../../peripherals/database/activity/BlockTransactionCountRepository'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from '../TransactionCounter'

export function createBlockTransactionCounter(
  projectId: ProjectId,
  processor: SequenceProcessor,
  blockRepository: BlockTransactionCountRepository,
): TransactionCounter {
  return new TransactionCounter(projectId, processor, () =>
    blockRepository.findLastTimestampByProjectId(projectId),
  )
}
