import { z } from 'zod'
import { Bridge, Layer2, Layer3 } from '../../src'

export type Project = Layer2 | Layer3 | Bridge

export type ContractSource = z.infer<typeof ContractSource>
export const ContractSource = z.object({
  SourceCode: z.string(),
})
export const ContractSourceResult = z.array(ContractSource).length(1)
