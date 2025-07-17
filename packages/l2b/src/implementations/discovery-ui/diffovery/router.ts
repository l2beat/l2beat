import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { Express } from 'express'
import type { DiffoveryController } from './DiffoveryController'

const ethereumAddressSchema = v.string().transform(ChainSpecificAddress)

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

    const address = encodedAddress.data

    try {
      const result = await controller.handle(address)
      res.json(result)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Invalid query address' })
    }
  })
}
