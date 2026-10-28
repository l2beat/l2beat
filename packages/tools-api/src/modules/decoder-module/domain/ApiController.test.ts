import { v } from '@l2beat/validate'
import { expect, mockObject } from 'earl'
import { describe } from 'mocha'
import { encodePacked, keccak256 } from 'viem'
import chainList from '../../../config/chains.json'
import { Chain } from '../../../config/types'
import type { ChainRpcClient } from '../../../third-party/ChainRpcClient'
import type { IAddressService } from './AddressService'
import { ApiController } from './ApiController'
import type { Decoder } from './Decoder'
import type { ISignatureService } from './SignatureService'

const chains = v.array(Chain).parse(chainList)
const ADMIN_SLOT_PREIMAGE = 'eip1967.proxy.admin'
const ADMIN_SLOT_HASH = keccak256(
  encodePacked(['string'], [ADMIN_SLOT_PREIMAGE]),
)
const ADMIN_SLOT: `0x${string}` = `0x${(BigInt(ADMIN_SLOT_HASH) - 1n).toString(16).padStart(64, '0')}`
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

describe(ApiController.name, () => {
  describe(ApiController.prototype.lookupPreimages.name, () => {
    it('finds exact and minus one preimages', () => {
      const controller = createController(mockObject<IAddressService>())

      const result = controller.lookupPreimages([
        ADMIN_SLOT_HASH,
        ADMIN_SLOT,
        `0x${'12'.repeat(32)}`,
      ])

      expect(result).toEqual([
        { hash: ADMIN_SLOT_HASH, preimage: ADMIN_SLOT_PREIMAGE },
        { hash: ADMIN_SLOT, preimage: ADMIN_SLOT_PREIMAGE, minusOne: true },
      ])
    })
  })

  describe(ApiController.prototype.lookupAddress.name, () => {
    it('returns token decimals for amount formatting', async () => {
      const addressService = mockObject<IAddressService>({
        lookup: async (address) => ({
          address,
          name: 'USDC',
          token: { name: 'USDC', decimals: 6 },
          explorerLink: `https://etherscan.io/address/${USDC}`,
          abi: [],
        }),
      })
      const controller = createController(addressService)

      const result = await controller.lookupAddress(1, USDC)

      expect(result).toEqual({
        chainId: 1,
        address: USDC,
        name: 'USDC',
        alias: undefined,
        token: { name: 'USDC', decimals: 6 },
        abi: [],
      })
      expect(addressService.lookup).toHaveBeenOnlyCalledWith(`eth:${USDC}`)
    })
  })
})

function createController(addressService: IAddressService) {
  return new ApiController(
    mockObject<Decoder>(),
    mockObject<ISignatureService>(),
    addressService,
    mockObject<ChainRpcClient>(),
    chains,
    { [ADMIN_SLOT_HASH]: ADMIN_SLOT_PREIMAGE },
  )
}
