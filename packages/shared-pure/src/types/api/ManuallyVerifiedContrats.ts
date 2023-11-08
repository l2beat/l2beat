import { z } from 'zod'

import { UrlPath } from '../UrlPath'

export const ManuallyVerifiedContracts = z.record(UrlPath)
export type ManuallyVerifiedContracts = z.infer<
  typeof ManuallyVerifiedContracts
>
