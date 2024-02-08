import { utils } from 'ethers'

export function toTopics(
  abi: utils.Interface,
  fragment: utils.EventFragment,
  definitionTopics?: (string | null)[],
): (string | null)[] {
  const topic0 = abi.getEventTopic(fragment)
  const topics = definitionTopics
    ? [
        topic0,
        ...definitionTopics.map((x) => (x ? utils.hexZeroPad(x, 32) : null)),
      ]
    : [topic0]
  return topics
}
