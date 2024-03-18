import z from 'zod'

import { branded } from '../branded'
import { EthereumAddress } from '../EthereumAddress'

export const ImplementationChangeReportChangeData = z.object({
  containingContract: branded(z.string(), EthereumAddress),
  newImplementations: z.array(branded(z.string(), EthereumAddress)),
})

export type ImplementationChangeReportChangeData = z.infer<typeof ImplementationChangeReportChangeData>

export const ImplementationChangeReportProjectData = z.record(
  z.string(),
  z.array(ImplementationChangeReportChangeData),
)

export type ImplementationChangeReportProjectData = z.infer<typeof ImplementationChangeReportProjectData>

export const ImplementationChangeReportApiResponse = z.object({
  projects: z.record(z.string(), ImplementationChangeReportProjectData),
})

export type ImplementationChangeReportApiResponse = z.infer<typeof ImplementationChangeReportApiResponse>

/**
const example: ImplementationChangeReportApiResponse = {
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
