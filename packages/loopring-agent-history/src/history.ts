import { Contract, providers } from 'ethers'

import { EventProcessor } from './EventProcessor'

const ABI = [
  'event AgentRegistered(address indexed user, address indexed agent, bool registered)',
]

export async function getHistory(
  provider: providers.Provider,
  eventProcessor: EventProcessor,
) {
  const agentRegistry = new Contract(
    '0x39b9bf169a7e225ba037c443a40460c77438ea14',
    ABI,
    provider,
  )
  const filter = agentRegistry.filters.AgentRegistered()
  const events = await agentRegistry.queryFilter(filter, 11149547)

  const processed = await Promise.all(
    events.map((e) => eventProcessor.processEvent(e)),
  )

  processed.sort((a, b) => a.blockNumber - b.blockNumber)

  for (const event of processed) {
    const time = new Date(event.timestamp * 1000).toISOString().substring(0, 10)
    console.log(
      time,
      ' ',
      event.user,
      event.agent,
      event.implementationName,
      event.implOfProxyName,
    )
  }
}
