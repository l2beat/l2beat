import type { TokenDatabase } from '@l2beat/database'
import { mockObject } from 'earl'
import { TokenService } from './TokenService'

describe(TokenService.name, () => {
  const _mockDb = mockObject<TokenDatabase>({})
})
