import { getErrorMessage } from '@l2beat/common'
import { isRevert } from '../utils/isRevert'

export function getProviderErrorMessage(e: unknown) {
  if (isRevert(e)) {
    return 'Execution reverted'
  }
  return getErrorMessage(e)
}
