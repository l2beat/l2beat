import { EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { Express } from 'express'
import type { DiffoveryController } from './DiffoveryController'

const ethereumAddressSchema = v
  .string()
  .check(
    (v) => /^[\w\d]+:0x[a-fA-F0-9]{40}$/.test(v),
    'Invalid address format. Must be chainId:0x...',
  )

export function attachDiffoveryRouter(
  app: Express,
  controller: DiffoveryController,
) {
  app.get('/api/flat-sources/:address', async (req, res) => {
    const encodedAddress = ethereumAddressSchema.safeParse(req.params.address)
    if (!encodedAddress.success) {
      res.status(400).json({ errors: encodedAddress.message })
      return
    }

    const [chain, address] = encodedAddress.data.split(':')
    if (!chain || !address) {
      res
        .status(400)
        .json({ error: 'Invalid address format. Must be chainId:0x...' })
      return
    }

    try {
      const result = await controller.handle(chain, EthereumAddress(address))
      res.json(result)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Invalid query address' })
    }
  })
}
