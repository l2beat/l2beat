import { HttpClient } from '@l2beat/shared'

interface BeaconChainResponse {
  data:
    | [
        {
          posConsensus: {
            slot: number
            epoch: number
          }
        },
      ]
    | null
}

export async function getL1Finality(
  httpClient: HttpClient,
  blockNumber: number,
): Promise<number | undefined> {
  const response = await httpClient.fetch(
    `https://beaconcha.in/api/v1/execution/block/${blockNumber}`,
  )
  const json = (await response.json()) as BeaconChainResponse
  if (!json.data) return undefined

  const slot = json.data[0].posConsensus.slot
  const epoch = json.data[0].posConsensus.epoch

  const isFirstInEpoch = slot % 32 === 0
  if (isFirstInEpoch) {
    return 64 * 12
  }
  const firstSlotInEpoch = epoch * 32
  const slotPositionInEpoch = slot - firstSlotInEpoch + 1
  const slotsLeftInEpoch = 32 - slotPositionInEpoch
  return (slotsLeftInEpoch + 64 + 1) * 12
}
