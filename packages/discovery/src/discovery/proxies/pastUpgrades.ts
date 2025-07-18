import {
  assert,
  ChainSpecificAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { LogDescription } from 'ethers/lib/utils'
import type { IProvider } from '../provider/IProvider'

export type DateAddresses = [string, Hash256, ChainSpecificAddress[]]

export async function getPastUpgradesSingleEvent(
  provider: IProvider,
  address: ChainSpecificAddress,
  eventABI: string,
  eventFiltering?: (log: LogDescription) => boolean,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([eventABI])
  const topics = Object.values(abi.events).map((e) => abi.getEventTopic(e.name))
  let logs = await provider.getLogs(address, [topics])
  if (eventFiltering !== undefined) {
    logs = logs.filter((l) => eventFiltering(abi.parseLog(l)))
  }

  const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
  const blocks = await Promise.all(
    blockNumbers.map(
      async (blockNumber) => await provider.getBlock(blockNumber),
    ),
  )
  assert(blocks.every((b) => b !== undefined))
  const dateMap = Object.fromEntries(
    blocks.map((b) => [b.number, UnixTime.toDate(b.timestamp).toISOString()]),
  )

  return logs.map((l) => {
    // NOTE(radomski): This is a hack to get around a bug inside decodeLog() in
    // ethers.js. If any arguments are indexed and string/bytes/tuple/array
    // the result for that field is not frozen. The subsequent call to the
    // result constructor does a check to see if entire object is frozen.
    // Since that new dynamic object is not frozen a subpar implementation of
    // deepCopy() fails to copy over the non-numeric keys from the args. We
    // want to always find the result of the implementation field and we're
    // unsure what the incoming event ABI is, so relaying on
    // `args.implementation` is faulty

    const parsed = abi.parseLog(l)
    let implementation: ChainSpecificAddress | undefined
    parsed.eventFragment.inputs.forEach((input, index) => {
      if (input.name === 'implementation') {
        implementation = ChainSpecificAddress.fromLong(
          provider.chain,
          parsed.args[index],
        )
      }
    })
    assert(implementation !== undefined)

    return [
      dateMap[l.blockNumber] ?? 'ERROR',
      Hash256(l.transactionHash),
      [implementation],
    ]
  })
}
