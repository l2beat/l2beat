import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { BaseAnalyzer } from '../analyzers/types/BaseAnalyzer'

export interface FinalityConfig<
  L2 extends RpcClient | StarknetClient = RpcClient,
> {
  projectId: ProjectId
  analyzer: BaseAnalyzer<L2>
  minTimestamp: UnixTime
}
