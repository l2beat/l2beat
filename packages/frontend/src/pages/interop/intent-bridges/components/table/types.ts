import type { BasicTableRow } from '~/components/table/BasicTable'
import type { IntentBridgeActivityEntry } from '~/server/features/scaling/interop/getIntentBridgesData'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'

export type IntentBridgeRow = BasicTableRow & {
  bridge: InteropIntentBridge
  activity: IntentBridgeActivityEntry | undefined
  activeChainCount: number | undefined
  activeTokenCount: number | undefined
  topRoute: ProtocolEntry['topRoute']
}
