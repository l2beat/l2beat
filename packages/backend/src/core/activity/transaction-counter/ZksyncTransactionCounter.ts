import { ProjectId } from '@l2beat/types'

import { ZksyncTransactionRepository } from '../../../peripherals/database/activity-v2/ZksyncTransactionRepository'
import { SequenceProcessor } from '../../SequenceProcessor'
import { TransactionCounter } from './TransactionCounter'

export function createZksyncTransactionCounter(
  projectId: ProjectId,
  processor: SequenceProcessor,
  zksyncRepository: ZksyncTransactionRepository,
): TransactionCounter {
  return new TransactionCounter(projectId, processor, () =>
    zksyncRepository.getLastTimestamp(),
  )
}
