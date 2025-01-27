import type { Logger } from '@l2beat/backend-tools'
import { bridges, tokenList } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'

export class LzOAppsController {
  constructor(private readonly logger: Logger) {}

  public getOApps() {
    const layerzeroBridge = bridges.find(
      (bridge) => bridge.id === ProjectId('lzomnichain'),
    )

    assert(layerzeroBridge, 'LayerZero bridge not found')

    const oApps = layerzeroBridge.config.escrows.flatMap((escrow) =>
      escrow.tokens === '*'
        ? []
        : escrow.tokens.map((token) => ({ address: escrow.address, token })),
    )

    const resolvedOApps = oApps.flatMap((oApp) => {
      const token = tokenList.find((token) => token.symbol === oApp.token)

      if (!token) {
        this.logger.warn(
          `Could not find token for oApp escrow remap: ${
            oApp.token
          } on ${oApp.address.toString()}`,
        )
        return []
      }

      return {
        address: oApp.address,
        name: token.name,
        symbol: token.symbol,
        iconUrl: token.iconUrl,
        chainId: token.chainId,
      }
    })

    return resolvedOApps
  }
}
