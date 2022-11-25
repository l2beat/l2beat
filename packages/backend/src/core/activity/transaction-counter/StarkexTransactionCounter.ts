import { ProjectId } from '@l2beat/types'

import { StarkexTransactionCountRepository } from '../../../peripherals/database/activity-v2/StarkexCountRepository'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from './TransactionCounter'

export function createStarkexTransactionCounter(
  projectId: ProjectId,
  processor: SequenceProcessor,
  starkexRepository: StarkexTransactionCountRepository,
): TransactionCounter {
  return new TransactionCounter(projectId, processor, () =>
    starkexRepository.getLastTimestampByProjectId(projectId),
  )
}
