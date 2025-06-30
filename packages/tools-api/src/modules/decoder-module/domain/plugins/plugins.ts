import type { DecodedCall, Value } from '../DecodedResult'
import { erc20Plugin } from './erc20Plugin'
import { multiSendPlugin } from './multiSendPlugin'
import { scheduleBatchPlugin } from './scheduleBatchPlugin'
import { sendTxToL1Plugin } from './sendTxToL1Plugin'
import type { NestedCall, Plugin } from './types'
import { whitebitBatchPlugin } from './whitebitBatchPlugin'
import { zkSyncUpgradePlugin } from './zkSyncUpgradePlugin'

export const plugins: Plugin[] = [
  erc20Plugin,
  multiSendPlugin,
  whitebitBatchPlugin,
  zkSyncUpgradePlugin,
  scheduleBatchPlugin,
  sendTxToL1Plugin,
  defaultPlugin,
]

function defaultPlugin(call: DecodedCall): NestedCall[] {
  return call.arguments.flatMap(getNestedBytes)
}

function getNestedBytes(value: Value): NestedCall[] {
  const nested: NestedCall[] = []
  if (value.decoded?.type === 'array') {
    for (const v of value.decoded.values) {
      nested.push(...getNestedBytes(v))
    }
  }
  if (value.decoded?.type === 'call') {
    for (const v of value.decoded.arguments) {
      nested.push(...getNestedBytes(v))
    }
  }
  if (value.decoded?.type === 'bytes' && value.decoded.dynamic) {
    nested.push({ data: value })
  }
  if (value.decoded?.type === 'number') {
    if (
      /amount/i.test(value.name) ||
      /value/i.test(value.name) ||
      value.name === 'wad'
    ) {
      value.decoded.hint = 'e18'
    }
    if (
      /date/i.test(value.name) ||
      /time/i.test(value.name) ||
      /expir/i.test(value.name) ||
      /since/i.test(value.name) ||
      /until/i.test(value.name)
    ) {
      value.decoded.hint = 'date'
    }
    if (
      /seconds/i.test(value.name) ||
      /duration/i.test(value.name) ||
      /delay/i.test(value.name) ||
      /wait/i.test(value.name)
    ) {
      value.decoded.hint = 'seconds'
    }
  }
  return nested
}
