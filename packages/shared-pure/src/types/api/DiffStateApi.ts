import z from 'zod'

import { branded } from '../branded'
import { EthereumAddress } from '../EthereumAddress'

export const DiffStateChangeData = z.object({
  containingContract: branded(z.string(), EthereumAddress),
  newImplementations: z.array(branded(z.string(), EthereumAddress)),
})

export type DiffStateChangeData = z.infer<typeof DiffStateChangeData>

export const DiffStateProjectData = z.record(
  z.string(),
  z.array(DiffStateChangeData),
)

export type DiffStateProjectData = z.infer<typeof DiffStateProjectData>

export const DiffStateApiResponse = z.object({
  projects: z.record(z.string(), DiffStateProjectData),
})

export type DiffStateApiResponse = z.infer<typeof DiffStateApiResponse>

/**
const example: DiffStateApiResponse = {
  projects: {
    arbitrum: {
      ethereum: [
        {
          containingContract: '0xrandomaddress_1',
          newImlementations: ['0xrandomaddress_2', '0xrandomaddress_3']
        },
        {
          containingContract: '0xrandomaddress_4',
          newImlementations: ['0xrandomaddress_5']
        }
      ],
      arbitrum: [
        {
          containingContract: '0xrandomaddress_6',
          newImlementations: ['0xrandomaddress_7']
        }
      ]
    },
  },
}
*/
