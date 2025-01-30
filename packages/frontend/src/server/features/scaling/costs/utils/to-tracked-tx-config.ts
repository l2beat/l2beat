import type { Layer2TxConfig } from '@l2beat/config'
import { createTrackedTxId } from '@l2beat/shared'
import type { ProjectId } from '@l2beat/shared-pure'
import { EthereumAddress } from '@l2beat/shared-pure'

const SHARP_SUBMISSION_ADDRESS = EthereumAddress(
  '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
)
const SHARP_SUBMISSION_SELECTOR = '0x9b3b76cc'

export function toTrackedTxConfig(
  projectId: ProjectId,
  configs: Layer2TxConfig[] | undefined,
) {
  if (configs === undefined) return

  return configs.flatMap((config) =>
    config.uses.map((use) => {
      const base = {
        projectId,
        sinceTimestamp: config.query.sinceTimestamp,
        untilTimestamp: config.query.untilTimestamp,
        type: use.type,
        subtype: use.subtype,
        costMultiplier:
          use.type === 'l2costs' ? config._hackCostMultiplier : undefined,
      }

      switch (config.query.formula) {
        case 'functionCall': {
          const withParams = {
            ...base,
            params: {
              formula: 'functionCall',
              address: config.query.address,
              selector: config.query.selector,
            },
          } as const
          return {
            ...withParams,
            id: createTrackedTxId(withParams),
          }
        }
        case 'transfer': {
          const withParams = {
            ...base,
            params: {
              formula: 'transfer',
              from: config.query.from,
              to: config.query.to,
            },
          } as const
          return {
            ...withParams,
            id: createTrackedTxId(withParams),
          }
        }
        case 'sharpSubmission': {
          const withParams = {
            ...base,
            params: {
              formula: 'sharpSubmission',
              address: SHARP_SUBMISSION_ADDRESS,
              selector: SHARP_SUBMISSION_SELECTOR,
              programHashes: config.query.programHashes,
            },
          } as const
          return {
            ...withParams,
            id: createTrackedTxId(withParams),
          }
        }
        case 'sharedBridge': {
          const withParams = {
            ...base,
            params: {
              formula: 'sharedBridge',
              address: config.query.address,
              signature: config.query.functionSignature,
              selector: config.query.selector,
              chainId: config.query.chainId,
            },
          } as const
          return {
            ...withParams,
            id: createTrackedTxId(withParams),
          }
        }
      }
    }),
  )
}
