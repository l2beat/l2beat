import { EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getSearchBarAddressEntries } from '~/server/features/search-bar/getSearchBarAddressEntries'
import { procedure, router } from '../trpc'

export const searchBarRouter = router({
  searchByAddress: procedure
    .input(
      v
        .string()
        .check((value) => EthereumAddress.checkIgnoringCase(value.trim())),
    )
    .query(({ input }) => getSearchBarAddressEntries(input)),
})
