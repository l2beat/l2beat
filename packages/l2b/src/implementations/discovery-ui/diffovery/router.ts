import { EthereumAddress } from '@l2beat/shared-pure'
import type { Express } from 'express'
import { z } from 'zod'
import type { DiffoveryController } from './DiffoveryController'

const ethereumAddressSchema = z.string().regex(/^[\w\d]+:0x[a-fA-F0-9]{40}$/, {
  message: 'Invalid address format. Must be chainId:0x...',
})

export function attachDiffoveryRouter(
  app: Express,
  controller: DiffoveryController,
) {
  app.get('/api/flat-sources/:address', async (req, res) => {
    const encodedAddress = ethereumAddressSchema.safeParse(req.params.address)
    if (!encodedAddress.success) {
      res.status(400).json({ errors: encodedAddress.error.flatten() })
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
    } catch {
      res.status(500).json({ error: 'Invalid query address' })
    }
  })
}
